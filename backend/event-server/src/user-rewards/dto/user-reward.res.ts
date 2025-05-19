import { ApiProperty } from '@nestjs/swagger';

class CouponBrief {
  @ApiProperty({ example: 'CP-ABC12345' })
  code: string;

  @ApiProperty({ example: '2025-06-30T00:00:00Z', required: false })
  expiresAt: string | null;
}

export class UserRewardRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rewardId: string;

  @ApiProperty({ enum: ['POINT', 'COUPON', 'ITEM'] })
  type: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({
    type: [CouponBrief],
    required: false,
    description: '발급된 쿠폰 목록 (COUPON 보상일 때만 존재)',
  })
  coupons?: CouponBrief[];
}
