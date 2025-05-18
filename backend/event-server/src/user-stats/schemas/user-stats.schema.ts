import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseDocument } from 'src/common/types/base-document';

export type UserStatsDocument = BaseDocument<UserStats>;

@Schema({ timestamps: true })
export class UserStats {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  loginDays: number;

  @Prop({ type: Number, default: 0 })
  inviteCount: number;

  @Prop({ type: Date, default: null })
  lastLoginAt: Date;

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

export const UserStatsSchema = SchemaFactory.createForClass(UserStats);
