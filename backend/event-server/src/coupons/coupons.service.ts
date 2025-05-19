import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RewardDocument } from 'src/rewards/schemas/reward.schema';
import { CouponRes } from './dto/coupon.res';
import { Coupon, CouponDocument } from './schemas/coupon.schema';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  async issue(userId: string, reward: RewardDocument): Promise<CouponRes[]> {
    const codes = Array.from({ length: reward.amount }, () => this.generateCouponCode());

    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const createdCoupons = await this.couponModel.insertMany(
      codes.map(code => ({
        userId: new Types.ObjectId(userId),
        rewardId: reward._id,
        code,
        expiresAt: oneMonthLater,
      })),
    );

    return createdCoupons.map(coupon => ({
      id: coupon._id.toString(),
      code: coupon.code,
      used: coupon.used,
      usedAt: coupon.usedAt?.toISOString() ?? null,
      expiresAt: coupon.expiresAt?.toISOString() ?? null,
      createdBy: coupon.createdBy?.toString() ?? '',
      updatedBy: coupon.updatedBy?.toString(),
      deletedBy: coupon.deletedBy?.toString(),
      createdAt: coupon.createdAt.toISOString(),
      updatedAt: coupon.updatedAt?.toISOString(),
      deletedAt: coupon.deletedAt?.toISOString(),
    }));
  }

  private generateCouponCode(): string {
    return 'CP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
