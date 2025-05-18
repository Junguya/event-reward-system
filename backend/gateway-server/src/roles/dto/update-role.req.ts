import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleReq {
  @ApiProperty({ example: 'ADMIN', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: '관리자', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
