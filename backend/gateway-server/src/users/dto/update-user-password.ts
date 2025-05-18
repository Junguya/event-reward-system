import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordReq {
  @ApiProperty({ example: 'password11!', description: '현재 비밀번호' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'password22!', description: '바꿀 비밀번호' })
  @IsString()
  newPassword: string;
}
