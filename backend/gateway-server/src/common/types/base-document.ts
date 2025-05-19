import { Document, Types } from 'mongoose';

export type BaseDocument<T> = T &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };
