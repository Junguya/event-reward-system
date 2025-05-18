import { ApiProperty } from '@nestjs/swagger';

export class UserRes {
  @ApiProperty({
    example: '664f5dbe24f6a9a1e6d2713b',
    description: '유저의 MongoDB ObjectId',
  })
  id: string;

  @ApiProperty({
    example: 'sinhy13@gmail.com',
    description: '유저 이메일',
  })
  email: string;

  @ApiProperty({
    example: '김준영',
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    example: 'M',
    enum: ['M', 'F', 'O'],
    description: '성별 (M: 남성, F: 여성, O: 기타)',
  })
  gender: string;

  @ApiProperty({
    example: ['664f5df824f6a9a1e6d27145'],
    type: [String],
    description: 'Role ObjectId 목록',
  })
  roles: string[];

  @ApiProperty({
    example: '2025-05-16T03:12:22.123Z',
    description: '생성 일시',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-05-16T03:12:22.123Z',
    description: '수정 일시',
  })
  updatedAt: Date;
}
