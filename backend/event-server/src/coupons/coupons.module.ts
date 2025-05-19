// src/coupons/coupons.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponsService } from './coupons.service';
import { Coupon, CouponSchema } from './schemas/coupon.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
