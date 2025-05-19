import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DevAuthGuard } from 'src/common/guards/dev-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';
import { CreateRewardRequestReq } from './dto/create-reward-request.req';
import { FilterRewardRequestQuery } from './dto/filter-reward-request.query';
import { RewardRequestRes } from './dto/reward-request.res';
import { RewardRequestsService } from './reward-requests.service';

@ApiTags('보상 요청')
@ApiBearerAuth('access-token')
@UseGuards(DevAuthGuard)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reward-requests')
export class RewardRequestsController {
  constructor(private readonly rewardRequestsService: RewardRequestsService) {}

  @Post()
  @Roles('USER')
  @ApiOperation({ summary: '보상 요청 (유저 전용)' })
  @ApiResponse({ status: 201, type: RewardRequestRes })
  async requestReward(
    @Body() createRewardRequestReq: CreateRewardRequestReq,
    @Req() req: AuthenticatedRequest,
  ): Promise<RewardRequestRes> {
    return this.rewardRequestsService.requestReward(createRewardRequestReq, req.user);
  }

  @Get()
  @ApiOperation({ summary: '보상 요청 내역 조회' })
  @ApiResponse({ status: 200, type: RewardRequestRes, isArray: true })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() filter: FilterRewardRequestQuery,
  ): Promise<RewardRequestRes[]> {
    const isUser = req.user.roles.includes('USER');
    return this.rewardRequestsService.findAll(req.user, isUser, filter);
  }
}
