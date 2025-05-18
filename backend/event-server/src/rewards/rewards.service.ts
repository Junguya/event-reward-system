import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRewardReq } from './dto/create-reward.req';
import { RewardRes } from './dto/reward.res';
import { UpdateRewardReq } from './dto/update-reward.req';
import { Reward, RewardDocument } from './schemas/reward.schema';

@Injectable()
export class RewardsService {
  constructor(@InjectModel(Reward.name) private readonly rewardModel: Model<RewardDocument>) {}

  private toRewardRes(doc: RewardDocument): RewardRes {
    const { _id, __v, ...rest } = doc.toObject();
    return { id: _id.toString(), ...rest };
  }

  async create(createRewardReq: CreateRewardReq, userId: string): Promise<RewardRes> {
    const created = new this.rewardModel({
      ...createRewardReq,
      createdBy: userId,
      updatedBy: userId,
    });

    const saved = await created.save();
    return this.toRewardRes(saved);
  }

  async findAll(): Promise<RewardRes[]> {
    const rewards = await this.rewardModel.find({ deletedAt: null }).sort({ createdAt: -1 }).exec();

    return rewards.map(reward => this.toRewardRes(reward));
  }

  async findById(id: string): Promise<RewardRes> {
    const reward = await this.rewardModel.findOne({ _id: id, deletedAt: null }).exec();
    if (!reward) throw new NotFoundException('보상을 찾을 수 없습니다.');

    return this.toRewardRes(reward);
  }

  async update(id: string, updateRewardReq: UpdateRewardReq, userId: string): Promise<RewardRes> {
    const updated = await this.rewardModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          ...updateRewardReq,
          updatedBy: new Types.ObjectId(userId),
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updated) throw new NotFoundException('보상을 찾을 수 없습니다.');
    return this.toRewardRes(updated);
  }

  async softDelete(id: string, userId: string): Promise<boolean> {
    const result = await this.rewardModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        {
          deletedAt: new Date(),
          deletedBy: new Types.ObjectId(userId),
        },
      )
      .exec();

    return !!result;
  }
}
