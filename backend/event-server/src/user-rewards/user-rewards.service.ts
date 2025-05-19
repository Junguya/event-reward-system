import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CouponsService } from 'src/coupons/coupons.service';
import { RewardDocument } from 'src/rewards/schemas/reward.schema';
import { UserStatsService } from 'src/user-stats/user-stats.service';
import { UserRewardRes } from './dto/user-reward.res';
import { UserReward, UserRewardDocument } from './schemas/user-rewards.schema';

@Injectable()
export class UserRewardsService {
  constructor(
    @InjectModel(UserReward.name)
    private readonly userRewardModel: Model<UserRewardDocument>,
    private readonly couponsService: CouponsService,
    private readonly userStatsService: UserStatsService,
  ) {}

  private toUserRewardRes(
    doc: UserRewardDocument,
    coupons?: { code: string; expiresAt: string | null }[],
  ): UserRewardRes {
    return {
      id: doc._id.toString(),
      rewardId: doc.rewardId.toString(),
      type: doc.type,
      amount: doc.amount,
      description: doc.description,
      createdAt: doc.createdAt.toISOString(),
      coupons,
    };
  }

  async grantReward(userId: string, reward: RewardDocument): Promise<UserRewardRes> {
    const session = await this.userRewardModel.db.startSession();
    session.startTransaction();

    try {
      switch (reward.type) {
        case 'POINT': {
          const rewardDoc = await this.userRewardModel.create(
            [
              {
                userId: new Types.ObjectId(userId),
                rewardId: reward._id,
                type: 'POINT',
                amount: reward.amount,
              },
            ],
            { session },
          );

          await this.userStatsService.addPoint(userId, reward.amount, session);

          await session.commitTransaction();
          return this.toUserRewardRes(rewardDoc[0]);
        }

        // 쿠폰은 트랜잭션 처리 필요 없으면 생략 가능
        case 'COUPON': {
          const coupons = await this.couponsService.issue(userId, reward); // 쿠폰은 insertMany 내부 트랜잭션 가능

          const rewardDoc = await this.userRewardModel.create(
            [
              {
                userId: new Types.ObjectId(userId),
                rewardId: reward._id,
                type: 'COUPON',
                amount: reward.amount,
                description: `쿠폰 ${reward.amount}장 지급됨 (예: ${coupons[0]?.code})`,
              },
            ],
            { session },
          );

          await session.commitTransaction();
          return this.toUserRewardRes(
            rewardDoc[0],
            coupons.map(c => ({
              code: c.code,
              expiresAt: c.expiresAt?.toString() ?? null,
            })),
          );
        }

        default:
          throw new BadRequestException(`지원하지 않는 보상 타입입니다: ${reward.type}`);
      }
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
