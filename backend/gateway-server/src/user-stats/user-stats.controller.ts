import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { extractAccessToken } from 'src/common/utils/auth.util';
import { UserStatsRes } from './dto/user-stats.res';
import { UserStatsService } from './user-stats.service';

@ApiTags('User Stats')
@ApiBearerAuth('access-token')
@Controller('user-stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}

  @Post(':userId/login')
  @ApiOperation({ summary: '로그인 시 loginDays 1 증가' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  async increaseLoginDays(@Param('userId') userId: string, @Req() req: Request) {
    const accessToken = extractAccessToken(req);
    return this.userStatsService.increaseLoginDays(userId, accessToken);
  }

  @Post(':userId/invite')
  @ApiOperation({ summary: '친구 초대 성공 시 inviteCount 1 증가' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  async increaseInviteCount(@Param('userId') userId: string, @Req() req: Request) {
    const accessToken = extractAccessToken(req);
    return this.userStatsService.increaseInviteCount(userId, accessToken);
  }

  @Get(':userId')
  @ApiOperation({ summary: '유저 통계 단건 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiOkResponse({ type: UserStatsRes })
  async findByUserId(@Param('userId') userId: string, @Req() req: Request): Promise<UserStatsRes> {
    const accessToken = extractAccessToken(req);
    return this.userStatsService.findByUserId(userId, accessToken);
  }
}
