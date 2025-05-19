// 로그인 요청 DTO
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInReq {
  @ApiProperty({ example: 'user@nexon.com', description: '이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password11!',
    description: '비밀번호 (영문, 숫자, 특수문자를 각각 하나 이상 포함한 8자 이상)',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
