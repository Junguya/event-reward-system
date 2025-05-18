import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.getJwtSecret(),
      signOptions: {
        expiresIn: this.getAccessTokenExpiry(),
      },
    };
  }

  getAccessTokenOptions() {
    return {
      secret: this.getJwtSecret(),
      expiresIn: this.getAccessTokenExpiry(),
    };
  }

  getRefreshTokenOptions() {
    return {
      secret: this.getJwtSecret(),
      expiresIn: this.getRefreshTokenExpiry(),
    };
  }

  // 내부 보호 메서드들
  private getJwtSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('환경 변수 JWT_SECRET이 설정되지 않았습니다.');
    }
    return secret;
  }

  private getAccessTokenExpiry(): string {
    return this.configService.get<string>('JWT_ACCESS_EXPIRE_TIME') || '1h';
  }

  private getRefreshTokenExpiry(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRE_TIME') || '7d';
  }
}
