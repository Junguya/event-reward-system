import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateUserReq } from './dto/create-user.req';
import { UpdatePasswordReq } from './dto/update-user-password';
import { UpdateUserReq } from './dto/update-user-req';
import { UpdateUserRoleReq } from './dto/update-user-role-req';
import { UserRes } from './dto/user.res';
import { UsersService } from './users.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: '관리자 전용 유저 생성' })
  async create(@Body() body: CreateUserReq): Promise<UserRes> {
    return this.usersService.create(body);
  }

  @Get()
  @Roles('OPERATOR', 'AUDITOR', 'ADMIN') // USER는 제외
  @ApiOperation({ summary: '유저 전체 조회 (운영자, 감사자, 관리자)' })
  async findAll(): Promise<UserRes[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('OPERATOR', 'AUDITOR', 'ADMIN') // USER는 제외
  @ApiOperation({ summary: '유저 단건 조회 (운영자, 감사자, 관리자)' })
  @ApiParam({ name: 'id', description: '유저 ID' })
  async findById(@Param('id') id: string): Promise<UserRes> {
    return this.usersService.findById(id);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '유저 정보 수정 (본인만)' })
  async updateMe(@Body() req: UpdateUserReq, @Req() request: any): Promise<UserRes> {
    return this.usersService.update(request.user._id, req);
  }

  @Patch('me/password')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '유저 비밀번호 변경 (본인만)' })
  async updatePassword(
    @Body() req: UpdatePasswordReq,
    @Req() request: any,
  ): Promise<{ message: string }> {
    await this.usersService.updatePassword(request.user._id, req);
    return { message: '비밀번호가 변경되었습니다.' };
  }

  @Patch(':id/roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN') // 관리자만 가능
  @ApiOperation({ summary: '유저 역할 수정 (관리자 전용)' })
  async updateUserRoles(@Param('id') id: string, @Body() req: UpdateUserRoleReq): Promise<UserRes> {
    return this.usersService.updateRoles(id, req);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '관리자 전용 유저 삭제' })
  @ApiParam({ name: 'id', description: '유저 ID' })
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.usersService.delete(id);
  }
}
