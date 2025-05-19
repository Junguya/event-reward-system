import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Coupon, CouponDocument } from 'src/coupons/schemas/coupon.schema';
import { Event, EventDocument } from 'src/events/schemas/event.schema';
import { Reward, RewardDocument } from 'src/rewards/schemas/reward.schema';
import { UserRewardsService } from 'src/user-rewards/user-rewards.service';
import { UserStats, UserStatsDocument } from 'src/user-stats/schemas/user-stats.schema';
import { CreateRewardRequestReq } from './dto/create-reward-request.req';
import { RewardRequestRes } from './dto/reward-request.res';
import { RewardRequest, RewardRequestDocument } from './schemas/reward-request.schema';

@Injectable()
export class RewardRequestsService {
  constructor(
    @InjectModel(RewardRequest.name)
    private readonly rewardRequestModel: Model<RewardRequestDocument>,

    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,

    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,

    @InjectModel(UserStats.name)
    private readonly userStatsModel: Model<UserStatsDocument>,

    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,

    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userRewardsService: UserRewardsService,
  ) {}

  async requestReward(
    createRewardRequestReq: CreateRewardRequestReq,
    userTokenPayload: { _id: string },
  ): Promise<RewardRequestRes> {
    const { eventId, rewardId } = createRewardRequestReq;

    // 1. 이벤트 조회 및 상태 확인
    const event = await this.eventModel.findOne({ _id: eventId, deletedAt: null }).exec();
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    const now = new Date();
    const isInPeriod =
      event.period?.start &&
      event.period?.end &&
      new Date(event.period.start) <= now &&
      now <= new Date(event.period.end);

    if (event.status !== 'ACTIVE' || !isInPeriod) {
      const reason = event.status !== 'ACTIVE' ? '이벤트 비활성화' : '이벤트 기간 아님';

      await this.rewardRequestModel.create({
        event: event._id,
        reward: rewardId,
        user: userTokenPayload._id,
        status: 'FAILED',
        reason,
        createdBy: userTokenPayload._id,
        updatedBy: userTokenPayload._id,
      });

      throw new BadRequestException(
        event.status !== 'ACTIVE'
          ? '이벤트가 활성화되어 있지 않습니다.'
          : '이벤트 기간이 아닙니다.',
      );
    }

    // 2. 보상 조회
    const reward = await this.rewardModel
      .findOne({
        _id: rewardId,
        event: eventId,
        deletedAt: null,
      })
      .exec();
    if (!reward) throw new NotFoundException('보상을 찾을 수 없습니다.');

    // 3. 유저 정보 조회
    const authUrl = this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
    const { data: user } = await this.httpService.axiosRef.get(
      `${authUrl}/internal/users/${userTokenPayload._id}`,
    );

    // 4. 중복 요청 검사 (성공한 요청만)
    const existing = await this.rewardRequestModel
      .findOne({
        event: eventId,
        reward: rewardId,
        status: 'SUCCESS',
        user: userTokenPayload._id,
        deletedAt: null,
      })
      .exec();

    if (existing) {
      await this.rewardRequestModel.create({
        event: event._id,
        reward: reward._id,
        user: user.id,
        status: 'FAILED',
        reason: '중복 요청',
        createdBy: user.id,
        updatedBy: user.id,
      });
      throw new BadRequestException('이미 보상을 요청하였습니다.');
    }

    // 5. 유저 통계 확인 및 조건 체크
    const userStats = await this.userStatsModel.findOne({ userId: user.id }).exec();
    if (!userStats) throw new BadRequestException('유저 통계 정보가 존재하지 않습니다.');

    if (!this.checkCondition(userStats, event)) {
      await this.rewardRequestModel.create({
        event: event._id,
        reward: reward._id,
        user: user.id,
        status: 'FAILED',
        reason: '이벤트 조건 미충족',
        createdBy: user.id,
        updatedBy: user.id,
      });
      throw new BadRequestException('이벤트 조건을 충족하지 않았습니다.');
    } else {
      // 6. 쿠폰 번호 생성
      const grantReward = await this.userRewardsService.grantReward(user.id, reward);

      // 7. 요청 이력 저장
      const created = new this.rewardRequestModel({
        event: event._id,
        reward: reward._id,
        user: user.id,
        status: 'SUCCESS',
        createdBy: user.id,
        updatedBy: user.id,
      });
      const saved = await created.save();

      // 8. 응답 구성
      return {
        id: saved._id.toString(),
        event: {
          id: event._id.toString(),
          title: event.title,
        },
        reward: {
          id: reward._id.toString(),
          type: reward.type,
          amount: reward.amount,
          coupons: grantReward.coupons,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles.map((role: any) => role.name),
        },
        status: created.status,
        reason: created.reason,
        createdBy: user.id,
        updatedBy: user.id,
        createdAt: saved.createdAt.toISOString(),
        updatedAt: saved.updatedAt?.toISOString(),
      };
    }
  }

  private checkCondition(userStats: UserStatsDocument, event: EventDocument): boolean {
    const { type, value } = event.condition;

    switch (type) {
      case 'LOGIN_DAYS':
        return userStats.loginDays >= value;
      case 'INVITE_FRIENDS':
        return userStats.inviteCount >= value;
      case 'TOTAL_POINTS':
        return userStats.point >= value;
      default:
        return false;
    }
  }

  async findAll(
    userTokenPayload: { _id: string; roles: string[] },
    isUser: boolean,
    filter?: { eventId?: string; status?: 'SUCCESS' | 'FAILED' },
  ): Promise<RewardRequestRes[]> {
    const query: Record<string, any> = { deletedAt: null };
    if (isUser) {
      query.user = userTokenPayload._id;
    }

    if (filter?.eventId) {
      query.event = new Types.ObjectId(filter.eventId);
    }

    if (filter?.status) {
      query.status = filter.status;
    }

    const requests = await this.rewardRequestModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('event')
      .populate('reward')
      .lean();

    const showCouponCodes = isUser || userTokenPayload.roles.includes('ADMIN');

    return await Promise.all(
      requests.map(async doc => {
        const event = doc.event as unknown as EventDocument;
        const reward = doc.reward as unknown as RewardDocument;

        const authUrl = this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
        const { data: user } = await this.httpService.axiosRef.get(
          `${authUrl}/internal/users/${doc.user}`, // 주의: 요청자 기준
        );

        let coupons: { code: string; expiresAt: string | null }[] | undefined;
        if (reward.type === 'COUPON' && showCouponCodes) {
          coupons = await this.couponModel
            .find({ rewardId: reward._id, userId: doc.user })
            .select({ code: 1, expiresAt: 1 })
            .lean()
            .then(items =>
              items.map(c => ({
                code: c.code,
                expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
              })),
            );
          console.log('coupons', coupons);
          console.log('rewardId', reward._id);
          console.log('userId', doc.user);
        }

        return {
          id: doc._id.toString(),
          event: {
            id: event._id.toString(),
            title: event.title,
          },
          reward: {
            id: reward._id.toString(),
            type: reward.type,
            amount: reward.amount,
            coupons,
          },
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles.map((role: any) => role.name),
          },
          status: doc.status,
          reason: doc.reason,
          createdBy: doc.createdBy?.toString(),
          updatedBy: doc.updatedBy?.toString(),
          deletedBy: doc.deletedBy?.toString(),
          createdAt: doc.createdAt.toISOString(),
          updatedAt: doc.updatedAt?.toISOString(),
          deletedAt: doc.deletedAt?.toISOString(),
        };
      }),
    );
  }
}
