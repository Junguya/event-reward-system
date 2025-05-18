import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleReq } from './dto/create-role.req';
import { RoleRes } from './dto/role.res';
import { UpdateRoleReq } from './dto/update-role.req';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) // ✅ Role.name은 'Role' 클래스명이며 schema key와 일치
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async onModuleInit() {
    const defaultRoles: { code: string; name: string }[] = [
      { code: 'USER', name: '일반 사용자' },
      { code: 'ADMIN', name: '관리자' },
      { code: 'OPERATOR', name: '운영자' },
      { code: 'AUDITOR', name: '감사자' },
    ];

    for (const role of defaultRoles) {
      const exists = await this.roleModel.exists({ code: role.code });
      if (!exists) {
        await this.roleModel.create(role);
        Logger.log(`기본 역할 추가됨: ${role.code} - ${role.name}`, 'RolesService');
      }
    }
  }

  async create(req: CreateRoleReq): Promise<RoleRes> {
    const created = new this.roleModel(req);
    const saved = await created.save();
    const { _id, __v, ...rest } = saved.toObject();
    return { id: _id.toString(), ...rest };
  }

  async findAll(): Promise<RoleRes[]> {
    const roles = await this.roleModel.find().lean();
    return roles.map(({ _id, __v, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));
  }

  async update(id: string, req: UpdateRoleReq): Promise<RoleRes> {
    const updated = await this.roleModel.findByIdAndUpdate(id, req, { new: true });
    if (!updated) throw new NotFoundException('역할을 찾을 수 없습니다.');
    const { _id, __v, ...rest } = updated.toObject();
    return { id: _id.toString(), ...rest };
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.roleModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('역할을 찾을 수 없습니다.');
    return true;
  }
}
