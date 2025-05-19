import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { extractAccessToken } from '../common/utils/auth.util';
import { UsersService } from './users.service';

import { CreateUserReq } from './dto/create-user.req';
import { UpdatePasswordReq } from './dto/update-user-password';
import { UpdateUserReq } from './dto/update-user-req';
import { UpdateUserRoleReq } from './dto/update-user-role-req';
import { UserRes } from './dto/user.res';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: '유저 생성 (관리자)' })
  create(@Req() req: Request, @Body() createUserReq: CreateUserReq): Promise<UserRes> {
    const accessToken = extractAccessToken(req);
    return this.usersService.create(createUserReq, accessToken);
  }

  @Get()
  @Roles('OPERATOR', 'AUDITOR', 'ADMIN')
  @ApiOperation({ summary: '유저 전체 조회 (운영자, 감사자, 관리자)' })
  findAll(@Req() req: Request): Promise<UserRes[]> {
    const accessToken = extractAccessToken(req);
    return this.usersService.findAll(accessToken);
  }

  @Get(':id')
  @Roles('OPERATOR', 'AUDITOR', 'ADMIN')
  @ApiOperation({ summary: '유저 단건 조회 (운영자, 감사자, 관리자)' })
  @ApiParam({ name: 'id', description: '유저 ID' })
  findOne(@Req() req: Request, @Param('id') id: string): Promise<UserRes> {
    const accessToken = extractAccessToken(req);
    return this.usersService.findById(id, accessToken);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard) // 본인만
  @ApiOperation({ summary: '유저 정보 수정 (본인만)' })
  updateMe(@Req() req: Request, @Body() updateUserReq: UpdateUserReq): Promise<UserRes> {
    const accessToken = extractAccessToken(req);
    return this.usersService.updateMe(updateUserReq, accessToken);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard) // 본인만
  @ApiOperation({ summary: '유저 비밀번호 변경 (본인만)' })
  updatePassword(
    @Req() req: Request,
    @Body() updatePasswordReq: UpdatePasswordReq,
  ): Promise<{ message: string }> {
    const accessToken = extractAccessToken(req);
    return this.usersService.updatePassword(updatePasswordReq, accessToken);
  }

  @Patch(':id/roles')
  @Roles('ADMIN')
  @ApiOperation({ summary: '유저 역할 수정 (관리자)' })
  updateUserRoles(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateUserRoleReq: UpdateUserRoleReq,
  ): Promise<UserRes> {
    const accessToken = extractAccessToken(req);
    return this.usersService.updateRoles(id, updateUserRoleReq, accessToken);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '유저 삭제 (관리자)' })
  @ApiParam({ name: 'id', description: '유저 ID' })
  remove(@Req() req: Request, @Param('id') id: string): Promise<boolean> {
    const accessToken = extractAccessToken(req);
    return this.usersService.remove(id, accessToken);
  }
}
