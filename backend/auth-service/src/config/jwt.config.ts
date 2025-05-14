// src/config/jwt.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private config: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.config.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRE_TIME', '10h'), // Access 토큰 만료 시간
      },
    };
  }

  getRefreshTokenOptions(): JwtModuleOptions {
    return {
      secret: this.config.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRE_TIME', '30d'),
      },
    };
  }
}
