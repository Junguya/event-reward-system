import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DevAuthGuard } from 'src/common/guards/dev-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';
import { CreateRewardReq } from './dto/create-reward.req';
import { RewardRes } from './dto/reward.res';
import { UpdateRewardReq } from './dto/update-reward.req';
import { RewardsService } from './rewards.service';

@ApiTags('보상')
@ApiBearerAuth('access-token')
@UseGuards(DevAuthGuard)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 등록 (운영자 이상)' })
  @ApiResponse({ status: 201, type: RewardRes })
  async create(@Body() createRewardReq: CreateRewardReq, @Req() req: AuthenticatedRequest) {
    return this.rewardsService.create(createRewardReq, req.user._id);
  }

  @Get()
  @Roles('OPERATOR', 'AUDITOR', 'ADMIN')
  @ApiOperation({ summary: '보상 전체 조회' })
  @ApiResponse({ status: 200, type: RewardRes, isArray: true })
  async findAll() {
    return this.rewardsService.findAll();
  }

  @Get(':id')
  @Roles('OPERATOR', 'AUDITOR', 'ADMIN')
  @ApiOperation({ summary: '보상 상세 조회' })
  @ApiResponse({ status: 200, type: RewardRes })
  async findById(@Param('id') id: string) {
    return this.rewardsService.findById(id);
  }

  @Patch(':id')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '보상 수정 (운영자 이상)' })
  @ApiResponse({ status: 200, type: RewardRes })
  async update(
    @Param('id') id: string,
    @Body() updateRewardReq: UpdateRewardReq,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.rewardsService.update(id, updateRewardReq, req.user._id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '보상 삭제 (관리자만, 소프트 삭제)' })
  @ApiResponse({ status: 200, description: '삭제 성공 여부 (true/false)' })
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.rewardsService.softDelete(id, req.user._id);
  }
}
