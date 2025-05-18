import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from '../roles/schemas/role.schema';
import { CreateUserReq } from './dto/create-user.req';
import { UpdatePasswordReq } from './dto/update-user-password.req';
import { UpdateUserRoleReq } from './dto/update-user-role.req';
import { UpdateUserReq } from './dto/update-user.req';
import { UserRes } from './dto/user.res';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  private transformUser(user: any): UserRes {
    const { _id, __v, roles, ...rest } = user;

    const cleanedRoles = Array.isArray(roles)
      ? roles.map(({ _id, __v, ...roleRest }) => roleRest)
      : [];

    return { id: _id, ...rest, roles: cleanedRoles };
  }

  //* 유저 생성
  async create(createUserReq: CreateUserReq): Promise<UserRes> {
    const existing = await this.userModel.findOne({ email: createUserReq.email });
    if (existing) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(createUserReq.password, 10);

    let roleCodes = createUserReq.roles;
    if (!roleCodes || roleCodes.length === 0) {
      roleCodes = ['USER'];
    }

    const roleDocs = await this.roleModel.find({ code: { $in: roleCodes } });
    if (roleDocs.length !== roleCodes.length) {
      const found = roleDocs.map(r => r.name);
      const notFound = roleCodes.filter(name => !found.includes(name));
      throw new BadRequestException(`존재하지 않는 역할: ${notFound.join(', ')}`);
    }

    const roleIds = roleDocs.map(r => r._id);

    const created = new this.userModel({
      ...createUserReq,
      password: hashedPassword,
      roles: roleIds,
    });

    const saved = await created.save();

    const populated = await this.userModel
      .findById(saved._id)
      .populate({ path: 'roles', select: '-_id -__v' })
      .lean(); // lean()으로 Buffer 문제 방지

    return this.transformUser(populated);
  }

  //* 유저 조회(Email)
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  //* 유저 조회(ID)
  async findById(id: Types.ObjectId | string): Promise<UserRes> {
    const user = await this.userModel.findById(id).populate('roles');
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');
    return this.transformUser(user.toObject());
  }

  //* JWT용 유저 조회(ID)
  async findByIdDocument(id: Types.ObjectId | string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).populate('roles');
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');
    return user;
  }

  //* 유저 전체 조회
  async findAll(): Promise<UserRes[]> {
    const users = await this.userModel.find().populate('roles').lean();
    return users.map(this.transformUser);
  }

  //* 유저 정보 수정 (본인만)
  async update(id: Types.ObjectId | string, updateUserReq: UpdateUserReq): Promise<UserRes> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    Object.assign(user, updateUserReq);

    const updated = await user.save();

    const populated = await this.userModel
      .findById(updated._id)
      .populate({ path: 'roles', select: '-_id -__v' })
      .lean();

    return this.transformUser(populated);
  }

  //* 유저 비밀번호 변경
  async updatePassword(userId: string, updatePasswordReq: UpdatePasswordReq): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const isMatch = await bcrypt.compare(updatePasswordReq.currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');

    user.password = await bcrypt.hash(updatePasswordReq.newPassword, 10);
    await user.save();
  }

  //* 유저 역할 수정
  async updateRoles(
    id: Types.ObjectId | string,
    updateUserRoleReq: UpdateUserRoleReq,
  ): Promise<UserRes> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const roleDocs = await this.roleModel.find({ code: { $in: updateUserRoleReq.roles } });
    if (roleDocs.length !== updateUserRoleReq.roles.length) {
      const foundCodes = roleDocs.map(r => r.code);
      const notFound = updateUserRoleReq.roles.filter(code => !foundCodes.includes(code));
      throw new BadRequestException(`존재하지 않는 역할 코드: ${notFound.join(', ')}`);
    }

    user.roles = roleDocs.map(r => r._id);
    const updated = await user.save();

    const populated = await this.userModel
      .findById(updated._id)
      .populate({ path: 'roles', select: '-_id -__v' })
      .lean();

    return this.transformUser(populated);
  }

  //* 유저 삭제
  async delete(id: Types.ObjectId | string): Promise<boolean> {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('유저를 찾을 수 없습니다.');
    return true;
  }
}
