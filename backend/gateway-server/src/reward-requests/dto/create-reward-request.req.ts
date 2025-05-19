// src/reward-requests/dto/create-reward-request.req.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateRewardRequestReq {
  @ApiProperty({ example: '66514c87205c4cbefaf94612', description: '이벤트 ID' })
  @IsMongoId()
  eventId: string;

  @ApiProperty({ example: '66514d7f205c4cbefaf94615', description: '보상 ID' })
  @IsMongoId()
  rewardId: string;
}
