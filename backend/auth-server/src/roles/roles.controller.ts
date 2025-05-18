import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateRoleReq } from './dto/create-role.req';
import { RoleRes } from './dto/role.res';
import { UpdateRoleReq } from './dto/update-role.req';
import { RolesService } from './roles.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: '역할 생성 (ADMIN만 가능)' })
  @ApiBody({ type: CreateRoleReq })
  @ApiResponse({ status: 201, description: '역할 생성 성공', type: RoleRes })
  async create(@Body() createRoleReq: CreateRoleReq): Promise<RoleRes> {
    return this.rolesService.create(createRoleReq);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: '전체 역할 조회 (ADMIN만 가능)' })
  @ApiResponse({ status: 200, description: '역할 목록 조회 성공', type: [RoleRes] })
  async findAll(): Promise<RoleRes[]> {
    return this.rolesService.findAll();
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '역할 수정 (ADMIN만 가능)' })
  @ApiBody({ type: UpdateRoleReq })
  @ApiResponse({ status: 200, description: '역할 수정 성공', type: RoleRes })
  async update(@Param('id') id: string, @Body() updateRoleReq: UpdateRoleReq): Promise<RoleRes> {
    return this.rolesService.update(id, updateRoleReq);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '역할 삭제 (ADMIN만 가능)' })
  @ApiResponse({ status: 200, description: '역할 삭제 성공' })
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.rolesService.delete(id);
    return { success: true };
  }
}
