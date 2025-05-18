import { ApiProperty } from '@nestjs/swagger';

class EventConditionRes {
  @ApiProperty({ example: 'LOGIN_DAYS' })
  type: string;

  @ApiProperty({ example: 3 })
  value: number | string;
}

class EventPeriodRes {
  @ApiProperty({ example: '2025-06-01T00:00:00Z' })
  start: string;

  @ApiProperty({ example: '2025-06-30T23:59:59Z' })
  end: string;
}

export class EventRes {
  @ApiProperty({ example: '6649fa5e2e39d2ff72c777ed' })
  id: string;

  @ApiProperty({ example: '로그인 3일 이벤트' })
  title: string;

  @ApiProperty({
    example: '이벤트 기간 동안 3일간 로그인하면 보상을 드립니다.',
    required: false,
  })
  description?: string;

  @ApiProperty({ type: EventConditionRes })
  condition: EventConditionRes;

  @ApiProperty({ type: EventPeriodRes })
  period: EventPeriodRes;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: '2025-05-19T00:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-05-19T00:00:00Z' })
  updatedAt: string;

  @ApiProperty({ example: '6634b7e621b123456789abcd' })
  createdBy: string;

  @ApiProperty({ example: '6634b7e621b123456789abcd' })
  updatedBy: string;
}
