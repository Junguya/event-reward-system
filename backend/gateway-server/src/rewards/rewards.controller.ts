import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { extractAccessToken } from 'src/common/utils/auth.util';
import { CreateRewardReq } from './dto/create-reward.req';
import { RewardRes } from './dto/reward.res';
import { UpdateRewardReq } from './dto/update-reward.req';
import { RewardsService } from './rewards.service';

@ApiTags('Rewards')
@ApiBearerAuth('access-token')
@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 등록 (운영자, 관리자)' })
  @ApiOkResponse({ type: RewardRes })
  create(@Req() req: Request, @Body() createRewardReq: CreateRewardReq): Promise<RewardRes> {
    const accessToken = extractAccessToken(req);
    return this.rewardsService.create(createRewardReq, accessToken);
  }

  @Get()
  @ApiOperation({ summary: '보상 전체 조회' })
  @ApiOkResponse({ type: [RewardRes] })
  findAll(@Req() req: Request): Promise<RewardRes[]> {
    const accessToken = extractAccessToken(req);
    return this.rewardsService.findAll(accessToken);
  }

  @Get(':id')
  @ApiOperation({ summary: '보상 상세 조회' })
  @ApiOkResponse({ type: RewardRes })
  findById(@Param('id') id: string, @Req() req: Request): Promise<RewardRes> {
    const accessToken = extractAccessToken(req);
    return this.rewardsService.findById(id, accessToken);
  }

  @Patch(':id')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 수정 (운영자, 관리자)' })
  @ApiOkResponse({ type: RewardRes })
  update(
    @Param('id') id: string,
    @Body() updateRewardReq: UpdateRewardReq,
    @Req() req: Request,
  ): Promise<RewardRes> {
    const accessToken = extractAccessToken(req);
    return this.rewardsService.update(id, updateRewardReq, accessToken);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '보상 삭제 (관리자, 소프트 삭제)' })
  @ApiOkResponse({ type: Boolean })
  delete(@Param('id') id: string, @Req() req: Request): Promise<boolean> {
    const accessToken = extractAccessToken(req);
    return this.rewardsService.delete(id, accessToken);
  }
}
