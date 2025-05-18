import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DevAuthGuard } from 'src/common/guards/dev-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';
import { CreateEventReq } from './dto/create-event.req';
import { EventRes } from './dto/event.res';
import { UpdateEventReq } from './dto/update-event.req';
import { EventsService } from './events.service';

@ApiTags('이벤트')
@ApiBearerAuth('access-token')
@UseGuards(DevAuthGuard)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '이벤트 생성 (운영자, 관리자만)' })
  @ApiResponse({ status: 201, type: EventRes })
  async create(@Body() createEventReq: CreateEventReq, @Req() req: AuthenticatedRequest) {
    return this.eventsService.create(createEventReq, req.user._id);
  }

  @Get()
  @Roles('OPERATOR', 'AUDITOR', 'ADMIN')
  @ApiOperation({ summary: '이벤트 전체 조회' })
  @ApiResponse({ status: 200, type: [EventRes] })
  async findAll(@Req() req: AuthenticatedRequest) {
    const isUser = req.user.roles?.includes('USER');
    return this.eventsService.findAll(isUser);
  }

  @Get(':id')
  @ApiOperation({ summary: '이벤트 상세 조회' })
  @ApiResponse({ status: 200, type: EventRes })
  async findById(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const isUser = req.user.roles?.includes('USER');
    return this.eventsService.findById(id, isUser);
  }

  @Patch(':id')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '이벤트 수정 (운영자, 관리자만)' })
  @ApiResponse({ status: 200, type: EventRes })
  async update(
    @Param('id') id: string,
    @Body() updateEventReq: UpdateEventReq,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventsService.update(id, updateEventReq, req.user._id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '이벤트 삭제 (관리자만, 소프트 삭제)' })
  @ApiResponse({ status: 200, description: '삭제 성공 여부 (true/false)' })
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.eventsService.softDelete(id, req.user._id);
  }
}
