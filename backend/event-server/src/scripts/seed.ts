// event-server/scripts/seed.ts
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import { AppModule } from '../app.module';
import { EventsService } from '../events/events.service';
import { RewardsService } from '../rewards/rewards.service';

async function waitForAdminUser(authServiceURL: string, email: string): Promise<string> {
  const maxRetries = 10;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = 0; i < maxRetries; i++) {
    try {
      const { data } = await axios.get(`${authServiceURL}/internal/admin`, {
        params: { email },
      });

      Logger.log(`관리자 유저 확인됨: ${data.id}`, 'Seed');
      return data.id;
    } catch (err) {
      Logger.warn(`관리자 유저 조회 대기 중... (${i + 1}/${maxRetries})`, 'Seed');
      await delay(3000); // 3초 대기 후 재시도
    }
  }

  throw new Error(`관리자 유저(${email})가 일정 시간 내에 조회되지 않았습니다.`);
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventsService = app.get(EventsService);
  const rewardsService = app.get(RewardsService);
  const configService = app.get(ConfigService);

  Logger.log('이벤트 및 보상 시드 데이터 생성 시작', 'Seed');

  // 1. 관리자 ID 대기 & 조회
  const authServiceURL = configService.get<string>('AUTH_SERVICE_URL') || 'http://auth-server:3001';
  const adminEmail = 'admin@nexon.com';

  let adminId: string;
  try {
    adminId = await waitForAdminUser(authServiceURL, adminEmail);
  } catch (err) {
    Logger.error(err.message, 'Seed');
    process.exit(1);
  }

  // 2. 이벤트 생성
  const loginEvent = await eventsService.create(
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

  const pointEvent = await eventsService.create(
    {
      title: '누적 포인트 5000 이상 시 보상',
      description: '누적 포인트가 5000 이상인 유저에게 쿠폰을 지급합니다.',
      period: {
        start: new Date('2025-01-01').toISOString(),
        end: new Date('2099-12-31').toISOString(),
      },
      condition: {
        type: 'TOTAL_POINTS',
        value: 5000,
      },
      status: 'ACTIVE',
    },
    adminId,
  );

  Logger.log(`이벤트 생성 완료: ${loginEvent.title} ${pointEvent.title}`, 'Seed');

  // 3. 포인트 보상 등록
  await rewardsService.create(
    {
      type: 'POINT',
      amount: 5000,
      description: '3일 로그인 보상 포인트',
      event: loginEvent.id,
    },
    adminId,
  );

  await rewardsService.create(
    {
      type: 'COUPON',
      amount: 1,
      description: '누적 포인트 5000 이상 쿠폰',
      event: pointEvent.id,
    },
    adminId,
  );

  Logger.log('시드 데이터 생성 완료', 'Seed');

  await app.close();
}

bootstrap();
