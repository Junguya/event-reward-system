import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { extractAccessToken } from 'src/common/utils/auth.util';
import { CreateRewardRequestReq } from './dto/create-reward-request.req';
import { FilterRewardRequestQuery } from './dto/filter-reward-request.query';
import { RewardRequestRes } from './dto/reward-request.res';
import { RewardRequestsService } from './reward-requests.service';

@ApiTags('Reward Requests')
@ApiBearerAuth('access-token')
@Controller('reward-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardRequestsController {
  constructor(private readonly rewardRequestsService: RewardRequestsService) {}

  @Post()
  @Roles('USER')
  @ApiOperation({ summary: '보상 요청 (유저 전용)' })
  @ApiOkResponse({ type: RewardRequestRes })
  requestReward(
    @Body() createReq: CreateRewardRequestReq,
    @Req() req: Request,
  ): Promise<RewardRequestRes> {
    const accessToken = extractAccessToken(req);
    return this.rewardRequestsService.requestReward(createReq, accessToken);
  }

  @Get()
  @ApiOperation({ summary: '보상 요청 내역 조회' })
  @ApiOkResponse({ type: [RewardRequestRes] })
  findAll(
    @Req() req: Request,
    @Query() query: FilterRewardRequestQuery,
  ): Promise<RewardRequestRes[]> {
    const accessToken = extractAccessToken(req);
    return this.rewardRequestsService.findAll(accessToken, query);
  }
}
