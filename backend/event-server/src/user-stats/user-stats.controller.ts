import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserStatsRes } from './dto/user-stats.res';
import { UserStatsService } from './user-stats.service';

@ApiTags('유저 통계')
@Controller('user-stats')
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}

  @Post(':userId/login')
  @ApiOperation({ summary: '로그인 시 loginDays 1 증가' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  async increaseLoginDays(@Param('userId') userId: string, @Req() req: any) {
    await this.userStatsService.createIfNotExists(userId, req.user?._id ?? userId);
    await this.userStatsService.incrementLoginDays(userId, req.user?._id ?? userId);
    return { message: 'Login days updated' };
  }

  @Post(':userId/invite')
  @ApiOperation({ summary: '친구 초대 성공 시 inviteCount 1 증가' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  async increaseInviteCount(@Param('userId') userId: string, @Req() req: any) {
    await this.userStatsService.createIfNotExists(userId, req.user?._id ?? userId);
    await this.userStatsService.incrementInviteCount(userId, req.user?._id ?? userId);
    return { message: 'Invite count updated' };
  }

  @Get(':userId')
  @ApiOperation({ summary: '유저 통계 단건 조회' })
  @ApiParam({ name: 'userId', description: '유저 ID' })
  @ApiOkResponse({ type: UserStatsRes })
  async findByUserId(@Param('userId') userId: string): Promise<UserStatsRes> {
    return this.userStatsService.findByUserId(userId);
  }
}
