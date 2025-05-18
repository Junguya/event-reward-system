import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class RoleRes {
  @ApiProperty({ example: '664f5db...' })
  id: Types.ObjectId;

  @ApiProperty({ example: 'USER' })
  code: string;

  @ApiProperty({ example: '일반 사용자' })
  name: string;

  @ApiProperty({ example: '2025-05-16T03:12:22.123Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-16T03:12:22.123Z' })
  updatedAt: Date;
}
