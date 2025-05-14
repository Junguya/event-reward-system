import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@example.com',
    description: '이메일 주소 (계정 ID)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: '비밀번호 (6자 이상)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
