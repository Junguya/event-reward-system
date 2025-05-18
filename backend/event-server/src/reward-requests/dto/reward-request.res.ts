// src/reward-requests/dto/reward-request.res.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {
  @ApiProperty({ example: '6641c2b398f8f6e3c4ab25df' })
  id: string;

  @ApiProperty({ example: '김준영' })
  name: string;

  @ApiProperty({ example: 'sinhy13@gmail.com' })
  email: string;

  @ApiProperty({
    example: ['USER', 'ADMIN'],
    description: '유저가 가진 역할 이름 목록',
    isArray: true,
    type: String,
  })
  roles: string[];
}

export class EventInfo {
  @ApiProperty({ example: '66514c87205c4cbefaf94612' })
  id: string;

  @ApiProperty({ example: '출석 3일 이벤트' })
  title: string;
}

export class RewardInfo {
  @ApiProperty({ example: '66514d7f205c4cbefaf94615' })
  id: string;

  @ApiProperty({ example: 'POINT' })
  type: string;

  @ApiProperty({ example: 100 })
  amount: number;
}

export class RewardRequestRes {
  @ApiProperty({ example: '665151b7205c4cbefaf9461f' })
  id: string;

  @ApiProperty({ type: EventInfo })
  event: EventInfo;

  @ApiProperty({ type: RewardInfo })
  reward: RewardInfo;

  @ApiProperty({ type: UserInfo })
  user: UserInfo;

  @ApiProperty({ enum: ['SUCCESS', 'FAILED'] })
  status: 'SUCCESS' | 'FAILED';

  @ApiProperty({ required: false, nullable: true })
  reason?: string;

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
