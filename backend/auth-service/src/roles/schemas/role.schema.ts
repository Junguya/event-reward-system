import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from 'src/common/types/base-document';

export type RoleDocument = BaseDocument<Role>;

@Schema({ collection: 'roles', timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  code: string; // e.g. 'USER', 'ADMIN', 'OPERATOR', 'AUDITOR'

  @Prop()
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
