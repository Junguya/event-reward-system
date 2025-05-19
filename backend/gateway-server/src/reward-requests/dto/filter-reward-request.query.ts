import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class FilterRewardRequestQuery {
  @ApiPropertyOptional({ description: '이벤트 ID', example: '66514c87205c4cbefaf94612' })
  @IsOptional()
  @IsMongoId()
  eventId?: string;

  @ApiPropertyOptional({ description: '보상 요청 상태', enum: ['SUCCESS', 'FAILED'] })
  @IsOptional()
  @IsEnum(['SUCCESS', 'FAILED'])
  status?: 'SUCCESS' | 'FAILED';
}
