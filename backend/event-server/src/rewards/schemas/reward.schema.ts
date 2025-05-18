import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseDocument } from 'src/common/types/base-document';

export type RewardDocument = BaseDocument<Reward>;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ required: true }) // 예: POINT, COUPON 등
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  description?: string;

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

export const RewardSchema = SchemaFactory.createForClass(Reward);
