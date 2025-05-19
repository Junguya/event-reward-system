import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseDocument } from 'src/common/types/base-document';

export type CouponDocument = BaseDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Reward', required: true })
  rewardId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: Boolean, default: false })
  used: boolean;

  @Prop({ type: Date, default: null })
  usedAt: Date;

  @Prop({ type: Date, default: null })
  expiresAt: Date;

  // 공통 관리 필드
  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null })
  deletedBy: Types.ObjectId;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
