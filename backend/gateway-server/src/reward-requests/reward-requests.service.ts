import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { handleAxiosError } from 'src/common/utils/http-error.util';
import { CreateRewardRequestReq } from './dto/create-reward-request.req';
import { FilterRewardRequestQuery } from './dto/filter-reward-request.query';
import { RewardRequestRes } from './dto/reward-request.res';

@Injectable()
export class RewardRequestsService {
  private readonly baseUrl = process.env.EVENT_SERVICE_URL;

  constructor(private readonly http: HttpService) {}

  async requestReward(
    createReq: CreateRewardRequestReq,
    accessToken: string,
  ): Promise<RewardRequestRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.post(`${this.baseUrl}/reward-requests`, createReq, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async findAll(accessToken: string, query: FilterRewardRequestQuery): Promise<RewardRequestRes[]> {
    try {
      const { data } = await lastValueFrom(
        this.http.get(`${this.baseUrl}/reward-requests`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: query,
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
}
