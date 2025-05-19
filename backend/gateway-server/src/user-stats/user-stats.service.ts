import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { handleAxiosError } from 'src/common/utils/http-error.util';
import { UserStatsRes } from './dto/user-stats.res';

@Injectable()
export class UserStatsService {
  private readonly baseUrl = process.env.EVENT_SERVICE_URL;

  constructor(private readonly http: HttpService) {}

  async increaseLoginDays(userId: string, accessToken: string): Promise<{ message: string }> {
    try {
      const { data } = await lastValueFrom(
        this.http.post(`${this.baseUrl}/user-stats/${userId}/login`, null, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async increaseInviteCount(userId: string, accessToken: string): Promise<{ message: string }> {
    try {
      const { data } = await lastValueFrom(
        this.http.post(`${this.baseUrl}/user-stats/${userId}/invite`, null, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async findByUserId(userId: string, accessToken: string): Promise<UserStatsRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.get(`${this.baseUrl}/user-stats/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
}
