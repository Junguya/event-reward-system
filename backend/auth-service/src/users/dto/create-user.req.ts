import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { SignUpReq } from 'src/auth/dto/signup.req';

export class CreateUserReq extends SignUpReq {
  @ApiProperty({
    example: ['USER'],
    type: [String],
    description: '유저 역할 이름 목록 (입력하지 않으면 기본 USER 역할이 자동 할당됨)',
  })
  @IsArray()
  roles: string[];
}
