// src/config/service.config.ts
import { ConfigService } from '@nestjs/config';

/**
 * 서비스별 URL 불러오기
 */
export const getAuthServiceUrl = (config: ConfigService): string => {
  return config.get<string>('AUTH_SERVICE_URL', 'http://localhost:3000');
};

export const getEventServiceUrl = (config: ConfigService): string => {
  return config.get<string>('EVENT_SERVICE_URL', 'http://localhost:3002');
};
