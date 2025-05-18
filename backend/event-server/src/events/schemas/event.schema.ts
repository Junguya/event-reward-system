import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseDocument } from 'src/common/types/base-document';

export type EventDocument = BaseDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  })
  condition: {
    type: string;
    value: number;
  };

  @Prop({
    type: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    required: true,
    _id: false,
  })
  period: {
    start: Date;
    end: Date;
  };

  @Prop({ enum: ['ACTIVE', 'INACTIVE'], default: 'INACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

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

export const EventSchema = SchemaFactory.createForClass(Event);
