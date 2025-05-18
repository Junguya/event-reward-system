// src/events/dto/create-event.req.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class EventPeriod {
  @ApiProperty({ example: '2025-06-01T00:00:00Z' })
  @IsDateString()
  start: string;

  @ApiProperty({ example: '2025-06-30T23:59:59Z' })
  @IsDateString()
  end: string;
}

class EventCondition {
  @ApiProperty({
    example: 'LOGIN_DAYS',
    description: '조건 타입 (예: LOGIN_DAYS, INVITE_FRIENDS 등)',
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: 3,
    description: '조건 값 (ex: 로그인 3일이면 3)',
  })
  @IsNotEmpty()
  value: number | string;
}

export class CreateEventReq {
  @ApiProperty({ example: '로그인 3일 이벤트' })
  @IsString()
  title: string;

  @ApiProperty({
    example: '이벤트 기간 동안 3일간 로그인하면 보상을 드립니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: EventCondition })
  @IsObject()
  @ValidateNested()
  @Type(() => EventCondition)
  condition: EventCondition;

  @ApiProperty({ type: EventPeriod })
  @ValidateNested()
  @Type(() => EventPeriod)
  period: EventPeriod;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE'], default: 'INACTIVE' })
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status: 'ACTIVE' | 'INACTIVE';
}
