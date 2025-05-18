import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordReq {
  @ApiProperty({ example: 'OldPass123!' })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    example: 'NewPass456!',
    description: '8자 이상, 영문/숫자/특수문자 포함',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/, {
    message:
      '비밀번호는 최소 8자 이상이며, 영문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.',
  })
  newPassword: string;
}
