import { ApiProperty } from '@nestjs/swagger';

export class UserStatsRes {
  @ApiProperty({ example: '664f5dbe24f6a9a1e6d2713b' })
  userId: string;

  @ApiProperty({ example: 5, description: '로그인한 날짜 수' })
  loginDays: number;

  @ApiProperty({ example: 3, description: '초대한 친구 수' })
  inviteCount: number;

  @ApiProperty({
    example: '2025-05-18T10:20:30.000Z',
    description: '가장 마지막으로 로그인한 시각',
    required: false,
  })
  lastLoginAt?: string;

  @ApiProperty({ example: '2025-05-18T10:20:30.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-05-19T09:10:00.000Z' })
  updatedAt: string;
}
