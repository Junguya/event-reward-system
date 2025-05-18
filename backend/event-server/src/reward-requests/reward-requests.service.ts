import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from 'src/events/schemas/event.schema';
import { Reward, RewardDocument } from 'src/rewards/schemas/reward.schema';
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

    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async requestReward(
    createRewardRequestReq: CreateRewardRequestReq,
    userTokenPayload: { _id: string },
  ): Promise<RewardRequestRes> {
    const { eventId, rewardId } = createRewardRequestReq;

    const event = await this.eventModel.findOne({ _id: eventId, deletedAt: null }).exec();
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    const reward = await this.rewardModel
      .findOne({
        _id: rewardId,
        event: eventId,
        deletedAt: null,
      })
      .exec();
    if (!reward) throw new NotFoundException('보상을 찾을 수 없습니다.');

    const authUrl = this.configService.getOrThrow<string>('AUTH_SERVICE_URL');

    const { data: user } = await this.httpService.axiosRef.get(
      `${authUrl}/internal/users/${userTokenPayload._id}`,
    );

    const existing = await this.rewardRequestModel
      .findOne({
        event: eventId,
        reward: rewardId,
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

    const userStats = await this.userStatsModel.findOne({ userId: user.id }).exec();

    if (!userStats) {
      throw new BadRequestException('유저 통계 정보가 존재하지 않습니다.');
    }

    if (!this.checkCondition(userStats, event)) {
      await this.rewardRequestModel.create({
        event: event._id,
        reward: reward._id,
        user: user._id,
        status: 'FAILED',
        reason: '이벤트 조건 미충족',
        createdBy: user._id,
        updatedBy: user._id,
      });
      throw new BadRequestException('이벤트 조건을 충족하지 않았습니다.');
    }

    const created = new this.rewardRequestModel({
      event: event._id,
      reward: reward._id,
      user: user.id,
      status: 'SUCCESS',
      createdBy: user._id,
      updatedBy: user._id,
    });

    const saved = await created.save();

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

  private checkCondition(userStats: UserStatsDocument, event: EventDocument): boolean {
    const { type, value } = event.condition;

    switch (type) {
      case 'LOGIN_DAYS':
        return userStats.loginDays >= value;
      case 'INVITE_FRIENDS':
        return userStats.inviteCount >= value;
      default:
        return false;
    }
  }

  async findAll(
    userTokenPayload: { _id: string; roles: string[] },
    isUser: boolean,
  ): Promise<RewardRequestRes[]> {
    const query: Record<string, any> = { deletedAt: null };
    if (isUser) {
      query.user = userTokenPayload._id;
    }

    const requests = await this.rewardRequestModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('event')
      .populate('reward')
      .populate('createdBy')
      .populate('updatedBy')
      .populate('deletedBy')
      .lean()
      .exec();

    return await Promise.all(
      requests.map(async doc => {
        const obj = doc.toObject();

        const event = obj.event;
        const reward = obj.reward;

        const authUrl = this.configService.getOrThrow<string>('AUTH_SERVICE_URL');

        const { data: user } = await this.httpService.axiosRef.get(
          `${authUrl}/internal/users/${userTokenPayload._id}`,
        );

        return {
          id: obj._id.toString(),
          event: {
            id: event._id.toString(),
            title: event.title,
          },
          reward: {
            id: reward._id.toString(),
            type: reward.type,
            amount: reward.amount,
          },
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles.map((role: any) => role.name),
          },
          status: obj.status,
          reason: obj.reason,
          createdBy: obj.createdBy?.toString(),
          updatedBy: obj.updatedBy?.toString(),
          deletedBy: obj.deletedBy?.toString(),
          createdAt: obj.createdAt.toISOString(),
          updatedAt: obj.updatedAt?.toISOString(),
          deletedAt: obj.deletedAt?.toISOString(),
        };
      }),
    );
  }
}
