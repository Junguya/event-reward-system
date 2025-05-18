import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRewardReq {
  @ApiProperty({ example: 'COUPON', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    example: '친구 초대 5명 달성 시 쿠폰 지급',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
