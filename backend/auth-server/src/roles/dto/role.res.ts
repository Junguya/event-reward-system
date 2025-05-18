import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class RoleRes {
  @ApiProperty({ example: '664f5db...', description: 'Role의 MongoDB ObjectId' })
  id: Types.ObjectId;

  @ApiProperty({ example: 'USER', description: '역할 코드' })
  code: string;

  @ApiProperty({ example: '일반 사용자', description: '역할 이름' })
  name: string;

  @ApiProperty({ example: '2025-05-16T03:12:22.123Z', description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-16T03:12:22.123Z', description: '수정 일시' })
  updatedAt: Date;

  @ApiProperty({
    example: '2025-05-17T03:12:22.123Z',
    description: '삭제 일시',
    required: false,
  })
  deletedAt?: Date;

  @ApiProperty({
    example: '664f5dbe24f6a9a1e6d2713b',
    description: '생성자 ID',
  })
  createdBy: string;

  @ApiProperty({
    example: '664f5dbe24f6a9a1e6d2713b',
    description: '수정자 ID',
    required: false,
  })
  updatedBy?: string;

  @ApiProperty({
    example: '664f5dbe24f6a9a1e6d2713b',
    description: '삭제자 ID',
    required: false,
  })
  deletedBy?: string;
}
