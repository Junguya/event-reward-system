// src/rewards/dto/create-reward.req.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRewardReq {
  @ApiProperty({ example: '665023ad55fa622c28c771f4', description: '보상을 연결할 이벤트 ID' })
  @IsMongoId()
  event: string;

  @ApiProperty({ example: 'POINT', description: '보상 타입 (예: POINT, COUPON)' })
  @IsString()
  type: string;

  @ApiProperty({ example: 5000, description: '보상 수치 또는 수량' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: '출석 3일 달성 시 5000포인트 지급',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
