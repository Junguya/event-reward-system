// src/rewards/dto/reward.res.ts
import { ApiProperty } from '@nestjs/swagger';

export class RewardRes {
  @ApiProperty({ example: '6650d6fe54fae642a7db0421' })
  id: string;

  @ApiProperty({ example: '665023ad55fa622c28c771f4' })
  event: string;

  @ApiProperty({ example: 'POINT' })
  type: string;

  @ApiProperty({ example: 5000 })
  amount: number;

  @ApiProperty({ example: '출석 3일 달성 시 5000포인트 지급', required: false })
  description?: string;

  @ApiProperty({ example: '2025-05-19T00:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-05-19T00:00:00Z' })
  updatedAt: string;

  @ApiProperty({ example: '6641c2b398f8f6e3c4ab25df' })
  createdBy: string;

  @ApiProperty({ example: '6641c2b398f8f6e3c4ab25df' })
  updatedBy?: string;
}
