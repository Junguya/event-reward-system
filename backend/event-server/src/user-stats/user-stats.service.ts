import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStatsRes } from './dto/user-stats.res';
import { UserStats, UserStatsDocument } from './schemas/user-stats.schema';

@Injectable()
export class UserStatsService {
  constructor(
    @InjectModel(UserStats.name)
    private readonly userStatsModel: Model<UserStatsDocument>,
  ) {}

  private toUserStatsRes(doc: UserStatsDocument): UserStatsRes {
    const { _id, __v, ...rest } = doc.toObject();
    return {
      userId: doc.userId.toString(),
      loginDays: doc.loginDays,
      inviteCount: doc.inviteCount,
      lastLoginAt: doc.lastLoginAt?.toISOString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  async findByUserId(userId: string): Promise<UserStatsRes> {
    const stats = await this.userStatsModel.findOne({ userId, deletedAt: null }).exec();
    if (!stats) throw new NotFoundException('해당 유저의 통계 정보를 찾을 수 없습니다.');
    return this.toUserStatsRes(stats);
  }

  async createIfNotExists(userId: string, operatorId: string): Promise<UserStatsDocument> {
    let stats = await this.userStatsModel.findOne({ userId }).exec();
    if (!stats) {
      stats = new this.userStatsModel({
        userId,
        loginDays: 0,
        inviteCount: 0,
        createdBy: operatorId,
        updatedBy: operatorId,
      });
      await stats.save();
    }
    return stats;
  }

  async incrementLoginDays(userId: string, operatorId: string): Promise<void> {
    const stats = await this.userStatsModel.findOne({ userId }).exec();

    if (!stats) return;

    const last = stats.lastLoginAt;
    const today = new Date();
    const lastDate = last ? new Date(last) : null;

    const isSameDay =
      lastDate &&
      lastDate.getFullYear() === today.getFullYear() &&
      lastDate.getMonth() === today.getMonth() &&
      lastDate.getDate() === today.getDate();

    if (isSameDay) return;

    await this.userStatsModel
      .updateOne(
        { userId },
        {
          $inc: { loginDays: 1 },
          $set: {
            lastLoginAt: today,
            updatedBy: operatorId,
          },
        },
      )
      .exec();
  }

  async incrementInviteCount(userId: string, operatorId: string): Promise<void> {
    await this.userStatsModel
      .updateOne(
        { userId },
        {
          $inc: { inviteCount: 1 },
          $set: { updatedBy: operatorId },
        },
      )
      .exec();
  }
}
