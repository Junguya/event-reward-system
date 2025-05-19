import { ApiProperty } from '@nestjs/swagger';

export class CouponRes {
  @ApiProperty({ example: '64fa...' })
  id: string;

  @ApiProperty({ example: 'CP-ABCD1234' })
  code: string;

  @ApiProperty({ example: false })
  used: boolean;

  @ApiProperty({ example: null })
  usedAt: string | null;

  @ApiProperty({ example: null })
  expiresAt: string | null;

  @ApiProperty({ example: '664f5dbe24...', description: '생성자 ID' })
  createdBy: string;

  @ApiProperty({ example: '664f5dbe24...', required: false })
  updatedBy?: string;

  @ApiProperty({ example: '664f5dbe24...', required: false })
  deletedBy?: string;

  @ApiProperty({ example: '2025-05-19T00:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-05-19T00:00:00Z', required: false })
  updatedAt?: string;

  @ApiProperty({ example: '2025-05-20T00:00:00Z', required: false })
  deletedAt?: string;
}
