import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { extractAccessToken } from 'src/common/utils/auth.util';
import { CreateEventReq } from './dto/create-event.req';
import { EventRes } from './dto/event.res';
import { UpdateEventReq } from './dto/update-event.req';
import { EventsService } from './events.service';

@ApiTags('Events')
@ApiBearerAuth('access-token')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '이벤트 생성 (운영자, 관리자만)' })
  @ApiOkResponse({ type: EventRes })
  create(@Req() req: Request, @Body() createEventReq: CreateEventReq): Promise<EventRes> {
    const accessToken = extractAccessToken(req);
    return this.eventsService.create(createEventReq, accessToken);
  }

  @Get()
  @Roles('OPERATOR', 'AUDITOR', 'ADMIN', 'USER')
  @ApiOperation({ summary: '이벤트 전체 조회' })
  @ApiOkResponse({ type: [EventRes] })
  findAll(@Req() req: Request): Promise<EventRes[]> {
    const accessToken = extractAccessToken(req);
    return this.eventsService.findAll(accessToken);
  }

  @Get(':id')
  @ApiOperation({ summary: '이벤트 상세 조회' })
  @ApiOkResponse({ type: EventRes })
  findById(@Param('id') id: string, @Req() req: Request): Promise<EventRes> {
    const accessToken = extractAccessToken(req);
    return this.eventsService.findById(id, accessToken);
  }

  @Patch(':id')
  @Roles('OPERATOR', 'ADMIN')
  @ApiOperation({ summary: '이벤트 수정 (운영자, 관리자만)' })
  @ApiOkResponse({ type: EventRes })
  update(
    @Param('id') id: string,
    @Body() updateEventReq: UpdateEventReq,
    @Req() req: Request,
  ): Promise<EventRes> {
    const accessToken = extractAccessToken(req);
    return this.eventsService.update(id, updateEventReq, accessToken);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '이벤트 삭제 (관리자만, 소프트 삭제)' })
  @ApiOkResponse({ type: Boolean })
  delete(@Param('id') id: string, @Req() req: Request): Promise<boolean> {
    const accessToken = extractAccessToken(req);
    return this.eventsService.delete(id, accessToken);
  }
}
