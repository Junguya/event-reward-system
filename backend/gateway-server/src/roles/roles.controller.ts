import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { extractAccessToken } from 'src/common/utils/auth.util';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateRoleReq } from './dto/create-role.req';
import { RoleRes } from './dto/role.res';
import { UpdateRoleReq } from './dto/update-role.req';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: '역할 목록 조회 (ADMIN만 가능)' })
  @ApiOkResponse({ type: [RoleRes] })
  findAll(@Req() req: Request): Promise<RoleRes[]> {
    const rawHeader = req.headers.authorization;
    if (!rawHeader) throw new UnauthorizedException('Access Token 누락');
    const accessToken = rawHeader.replace('Bearer ', '');
    return this.rolesService.findAll(accessToken);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: '역할 생성 (ADMIN만 가능)' })
  @ApiOkResponse({ type: RoleRes })
  create(@Req() req: Request, @Body() createRoleReq: CreateRoleReq): Promise<RoleRes> {
    const accessToken = extractAccessToken(req);

    return this.rolesService.create(createRoleReq, accessToken);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '역할 수정 (ADMIN만 가능)' })
  @ApiOkResponse({ type: RoleRes })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateRoleReq: UpdateRoleReq,
  ): Promise<RoleRes> {
    const accessToken = extractAccessToken(req);

    return this.rolesService.update(id, updateRoleReq, accessToken);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '역할 삭제 (ADMIN만 가능)' })
  @ApiOkResponse({ type: Boolean })
  remove(@Req() req: Request, @Param('id') id: string): Promise<boolean> {
    const accessToken = extractAccessToken(req);

    return this.rolesService.remove(id, accessToken);
  }
}
