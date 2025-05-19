import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateUserReq } from './dto/create-user.req';
import { UpdatePasswordReq } from './dto/update-user-password.req';
import { UpdateUserRoleReq } from './dto/update-user-role.req';
import { UpdateUserReq } from './dto/update-user.req';
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
  @ApiOperation({ summary: '유저 생성 (관리자)' })
  async create(@Body() createUserReq: CreateUserReq): Promise<UserRes> {
    return this.usersService.create(createUserReq);
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
  async updateMe(@Body() updateUserReq: UpdateUserReq, @Req() request: any): Promise<UserRes> {
    return this.usersService.update(request.user._id, updateUserReq);
  }

  @Patch('me/password')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '유저 비밀번호 변경 (본인만)' })
  async updatePassword(
    @Body() updatePasswordReq: UpdatePasswordReq,
    @Req() request: any,
  ): Promise<{ message: string }> {
    await this.usersService.updatePassword(request.user._id, updatePasswordReq);
    return { message: '비밀번호가 변경되었습니다.' };
  }

  @Patch(':id/roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN') // 관리자만 가능
  @ApiOperation({ summary: '유저 역할 수정 (관리자)' })
  async updateUserRoles(
    @Param('id') id: string,
    @Body() updateUserRoleReq: UpdateUserRoleReq,
  ): Promise<UserRes> {
    return this.usersService.updateRoles(id, updateUserRoleReq);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '유저 삭제 (관리자)' })
  @ApiParam({ name: 'id', description: '유저 ID' })
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.usersService.delete(id);
  }
}

@ApiTags('INTERNAL USERS')
@Controller('internal')
export class InternalUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/:id')
  @ApiOperation({ summary: '유저 단건 조회 (내부 호출 전용)' })
  @ApiParam({ name: 'id', description: '유저 ID (ObjectId)' })
  async findByIdInternal(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('admin')
  @ApiOperation({ summary: '[내부용] 이메일로 유저 ID 조회' })
  @ApiQuery({ name: 'email', description: '이메일 (쿼리 파라미터)' })
  async getUserIdByEmail(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('이메일을 전달해야 합니다.');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`이메일에 해당하는 유저가 없습니다: ${email}`);
    }

    return {
      id: user._id.toString(),
      email: user.email,
    };
  }
}
