import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateUserRoleReq {
  @ApiProperty({ example: ['ADMIN', 'USER'], description: '변경할 역할 코드 목록' })
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
