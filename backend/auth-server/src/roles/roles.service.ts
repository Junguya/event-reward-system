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
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async createIfNotExists(code: string, name: string): Promise<RoleDocument> {
    const existing = await this.roleModel.findOne({ code });

    if (existing) {
      Logger.log(`역할 이미 존재함: ${code}`, 'RolesService');
      return existing;
    }

    const created = await this.roleModel.create({ code, name });
    Logger.log(`역할 생성됨: ${code} - ${name}`, 'RolesService');
    return created;
  }

  private toRoleRes(doc: RoleDocument): RoleRes {
    const { _id, __v, ...rest } = doc.toObject();
    return { id: _id.toString(), ...rest };
  }

  async create(createRoleReq: CreateRoleReq): Promise<RoleRes> {
    const created = new this.roleModel(createRoleReq);
    const saved = await created.save();
    return this.toRoleRes(saved);
  }

  async findAll(): Promise<RoleRes[]> {
    const roles = await this.roleModel.find({ deletedAt: null }).sort({ createdAt: -1 }).exec();
    return roles.map(role => this.toRoleRes(role));
  }

  async update(id: string, updateRoleReq: UpdateRoleReq): Promise<RoleRes> {
    const updated = await this.roleModel.findByIdAndUpdate(id, updateRoleReq, { new: true });
    if (!updated) throw new NotFoundException('역할을 찾을 수 없습니다.');
    return this.toRoleRes(updated);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.roleModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('역할을 찾을 수 없습니다.');
    return true;
  }
}
