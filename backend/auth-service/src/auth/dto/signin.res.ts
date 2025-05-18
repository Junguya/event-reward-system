import { ApiProperty } from '@nestjs/swagger';

export class UserData {
  @ApiProperty({ example: '64f0c8e7e24b5c23b7f8912a', description: '유저 ID' })
  id: string;

  @ApiProperty({ example: 'sinhy13@gmail.com', description: '이메일 주소' })
  email: string;

  @ApiProperty({ example: '김준영', description: '유저 이름' })
  name: string;

  @ApiProperty({
    example: 'M',
    enum: ['M', 'F', 'O'],
    description: '성별',
  })
  gender: string;

  @ApiProperty({
    isArray: true,
    example: ['USER', 'ADMIN'],
    description: '유저의 역할 이름 목록',
  })
  roles: string[];
}

export class SignInRes {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...', description: 'Access Token (JWT)' })
  accessToken: string;

  @ApiProperty({ type: UserData })
  user: UserData;
}
