import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { handleAxiosError } from '../common/utils/http-error.util';
import { CreateUserReq } from './dto/create-user.req';
import { UpdatePasswordReq } from './dto/update-user-password';
import { UpdateUserReq } from './dto/update-user-req';
import { UpdateUserRoleReq } from './dto/update-user-role-req';
import { UserRes } from './dto/user.res';

@Injectable()
export class UsersService {
  private readonly authBaseUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

  constructor(private readonly http: HttpService) {}

  async create(dto: CreateUserReq, accessToken: string): Promise<UserRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.post<UserRes>(`${this.authBaseUrl}/users`, dto, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async findAll(accessToken: string): Promise<UserRes[]> {
    try {
      const { data } = await lastValueFrom(
        this.http.get<UserRes[]>(`${this.authBaseUrl}/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async findById(id: string, accessToken: string): Promise<UserRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.get<UserRes>(`${this.authBaseUrl}/users/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async updateMe(dto: UpdateUserReq, accessToken: string): Promise<UserRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.patch<UserRes>(`${this.authBaseUrl}/users/me`, dto, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async updatePassword(dto: UpdatePasswordReq, accessToken: string): Promise<{ message: string }> {
    try {
      const { data } = await lastValueFrom(
        this.http.patch<{ message: string }>(`${this.authBaseUrl}/users/me/password`, dto, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async updateRoles(id: string, dto: UpdateUserRoleReq, accessToken: string): Promise<UserRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.patch<UserRes>(`${this.authBaseUrl}/users/${id}/roles`, dto, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async remove(id: string, accessToken: string): Promise<boolean> {
    try {
      const { data } = await lastValueFrom(
        this.http.delete<boolean>(`${this.authBaseUrl}/users/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
}
