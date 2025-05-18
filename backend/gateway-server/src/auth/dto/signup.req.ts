import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignUpReq {
  @ApiProperty({
    example: 'sinhy13@gmail.com',
    description: '이메일 주소',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password11!',
    description: '비밀번호 (영문, 숫자, 특수문자를 각각 하나 이상 포함한 8자 이상)',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/, {
    message:
      '비밀번호는 최소 8자 이상이며, 영문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({
    example: '김준영',
    description: '유저 이름',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'M',
    enum: ['M', 'F', 'O'],
    description: '성별 (M: 남성, F: 여성, O: 기타)',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['M', 'F', 'O'])
  gender: string;
}
