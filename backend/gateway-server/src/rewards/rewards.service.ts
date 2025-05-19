import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { handleAxiosError } from 'src/common/utils/http-error.util';
import { CreateRewardReq } from './dto/create-reward.req';
import { RewardRes } from './dto/reward.res';
import { UpdateRewardReq } from './dto/update-reward.req';

@Injectable()
export class RewardsService {
  private readonly baseUrl = process.env.EVENT_SERVICE_URL;

  constructor(private readonly http: HttpService) {}

  async create(createRewardReq: CreateRewardReq, accessToken: string): Promise<RewardRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.post(`${this.baseUrl}/rewards`, createRewardReq, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async findAll(accessToken: string): Promise<RewardRes[]> {
    try {
      const { data } = await lastValueFrom(
        this.http.get(`${this.baseUrl}/rewards`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async findById(id: string, accessToken: string): Promise<RewardRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.get(`${this.baseUrl}/rewards/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async update(
    id: string,
    updateRewardReq: UpdateRewardReq,
    accessToken: string,
  ): Promise<RewardRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.patch(`${this.baseUrl}/rewards/${id}`, updateRewardReq, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async delete(id: string, accessToken: string): Promise<boolean> {
    try {
      const { data } = await lastValueFrom(
        this.http.delete(`${this.baseUrl}/rewards/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
}
