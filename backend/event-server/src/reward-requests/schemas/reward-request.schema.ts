import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseDocument } from 'src/common/types/base-document';

export type RewardRequestDocument = BaseDocument<RewardRequest>;

@Schema({ collection: 'user_requests', timestamps: true })
export class RewardRequest {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Reward', required: true })
  reward: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ enum: ['SUCCESS', 'FAILED'], required: true })
  status: 'SUCCESS' | 'FAILED';

  @Prop({ type: String, default: null }) // 실패 사유 등 선택적
  reason?: string;

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

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
