// 토큰 재발급 응답 DTO
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRes {
  @ApiProperty()
  accessToken: string;
}
