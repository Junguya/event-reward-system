import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { handleAxiosError } from 'src/common/utils/http-error.util';
import { UserRes } from 'src/users/dto/user.res';
import { RefreshTokenRes } from './dto/refresh-token.res';
import { SignInReq } from './dto/signin.req';
import { SignInRes } from './dto/signin.res';
import { SignUpReq } from './dto/signup.req';

@Injectable()
export class AuthService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.getOrThrow<string>('AUTH_SERVICE_URL');
  }

  async signup(dto: SignUpReq): Promise<UserRes> {
    try {
      const { data } = await lastValueFrom(this.http.post(`${this.baseUrl}/auth/signup`, dto));
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async signin(dto: SignInReq): Promise<SignInRes & { refreshToken: string }> {
    try {
      const { data } = await lastValueFrom(
        this.http.post(`${this.baseUrl}/auth/signin`, dto, {
          withCredentials: true,
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async signout(refreshToken: string): Promise<boolean> {
    try {
      const { data } = await lastValueFrom(
        this.http.post(`${this.baseUrl}/auth/signout`, null, {
          headers: { Cookie: `refreshToken=${refreshToken}` },
        }),
      );
      return data?.success ?? true;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async reissueAccessToken(refreshToken: string): Promise<RefreshTokenRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.post(
          `${this.baseUrl}/auth/token/refresh`,
          { refreshToken },
          {
            withCredentials: true,
          },
        ),
      );

      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
}
