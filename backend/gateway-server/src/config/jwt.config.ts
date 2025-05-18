// src/config/jwt.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly config: ConfigService) {}

  getSecret(): string {
    return this.config.get<string>('JWT_SECRET', 'default_jwt_secret');
  }

  getRefreshTokenOptions() {
    return {
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    };
  }
}
