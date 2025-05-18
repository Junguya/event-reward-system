import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseDocument } from 'src/common/types/base-document';

export type UserDocument = BaseDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['M', 'F', 'O'] })
  gender: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Role' }],
    required: true,
    default: [],
  })
  roles: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
