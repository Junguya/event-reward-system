import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseDocument } from 'src/common/types/base-document';

export type UserRewardDocument = BaseDocument<UserReward>;

@Schema({ collection: 'user_rewards', timestamps: true })
export class UserReward {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Reward', required: true })
  rewardId: Types.ObjectId;

  @Prop({ type: String, required: true, enum: ['POINT', 'COUPON', 'ITEM'] })
  type: 'POINT' | 'COUPON' | 'ITEM';

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, default: null })
  description: string;

  // 공통 관리 필드
  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null })
  deletedBy: Types.ObjectId;
}

export const UserRewardSchema = SchemaFactory.createForClass(UserReward);
