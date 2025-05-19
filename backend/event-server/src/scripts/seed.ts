// event-server/scripts/seed.ts
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import { AppModule } from '../app.module';
import { EventsService } from '../events/events.service';
import { RewardsService } from '../rewards/rewards.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const eventsService = app.get(EventsService);
  const rewardsService = app.get(RewardsService);
  const configService = app.get(ConfigService);

  Logger.log('이벤트 및 보상 시드 데이터 생성 시작', 'Seed');

  // 1. 관리자 ID를 auth-server의 내부 API로부터 가져옴
  const authServiceURL = configService.get<string>('AUTH_SERVICE_URL');

  let adminId: string;
  try {
    const { data } = await axios.get('http://localhost:3001/internal/admin', {
      params: { email: 'admin@nexon.com' },
    });
    adminId = data.id;
    Logger.log(`관리자 유저 ID 조회 완료: ${adminId}`, 'Seed');
  } catch (err) {
    Logger.error('관리자 유저 ID 조회 실패', err);
    process.exit(1);
  }

  // 2. 이벤트 생성
  const event = await eventsService.create(
    {
      title: '3일 이상 로그인 시 보상',
      description: '유저가 3일 이상 로그인하면 5000포인트를 지급합니다.',
      period: {
        start: new Date('2025-01-01').toISOString(),
        end: new Date('2099-12-31').toISOString(),
      },
      condition: {
        type: 'LOGIN_DAYS',
        value: 3,
      },
      status: 'ACTIVE',
    },
    adminId,
  );

  Logger.log(`이벤트 생성 완료: ${event.title}`, 'Seed');

  // 3. 포인트 보상 등록
  await rewardsService.create(
    {
      type: 'POINT',
      amount: 5000,
      description: '3일 로그인 보상 포인트',
      event: event.id,
    },
    adminId,
  );

  Logger.log('시드 데이터 생성 완료', 'Seed');

  await app.close();
}

bootstrap();
