import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleReq {
  @ApiProperty({ example: 'USER' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: '일반 사용자' })
  @IsString()
  name: string;
}
