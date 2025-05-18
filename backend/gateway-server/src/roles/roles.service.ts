import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { handleAxiosError } from 'src/common/utils/http-error.util';
import { CreateRoleReq } from './dto/create-role.req';
import { RoleRes } from './dto/role.res';
import { UpdateRoleReq } from './dto/update-role.req';

@Injectable()
export class RolesService {
  private readonly authBaseUrl = process.env.AUTH_SERVICE_URL;

  constructor(private readonly http: HttpService) {}

  async findAll(accessToken: string): Promise<RoleRes[]> {
    try {
      const { data } = await lastValueFrom(
        this.http.get<RoleRes[]>(`${this.authBaseUrl}/roles`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async create(createRoleReq: CreateRoleReq, accessToken: string): Promise<RoleRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.post<RoleRes>(`${this.authBaseUrl}/roles`, createRoleReq, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async update(id: string, updateRoleReq: UpdateRoleReq, accessToken: string): Promise<RoleRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.patch<RoleRes>(`${this.authBaseUrl}/roles/${id}`, updateRoleReq, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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
        this.http.delete<boolean>(`${this.authBaseUrl}/roles/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
}
