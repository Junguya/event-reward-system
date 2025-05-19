import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const rolesService = app.get(RolesService);
  const usersService = app.get(UsersService);

  Logger.log('시드 데이터 생성 시작', 'Seed');

  // 1. 기본 역할 생성
  const defaultRoles: { code: string; name: string }[] = [
    { code: 'USER', name: '일반 사용자' },
    { code: 'ADMIN', name: '관리자' },
    { code: 'OPERATOR', name: '운영자' },
    { code: 'AUDITOR', name: '감사자' },
  ];

  for (const role of defaultRoles) {
    await rolesService.createIfNotExists(role.code, role.name);
  }

  // 2. 테스트용 유저 생성
  const users = [
    {
      email: 'admin@nexon.com',
      password: 'password11!',
      name: '관리자',
      gender: 'M',
      roles: ['ADMIN'],
    },
    {
      email: 'auditor@nexon.com',
      password: 'password11!',
      name: '감사자',
      gender: 'F',
      roles: ['AUDITOR'],
    },
    {
      email: 'operator@nexon.com',
      password: 'password11!',
      name: '운영자',
      gender: 'M',
      roles: ['OPERATOR'],
    },
    {
      email: 'user@nexon.com',
      password: 'password11!',
      name: '유저',
      gender: 'F',
      roles: ['USER'],
    },
  ];

  for (const user of users) {
    const exists = await usersService.findByEmail(user.email);
    if (!exists) {
      await usersService.create(user);
      Logger.log(`유저 생성됨: ${user.email}`, 'Seed');
    } else {
      Logger.log(`이미 존재함: ${user.email}`, 'Seed');
    }
  }

  await app.close();
  Logger.log('시드 데이터 생성 완료', 'Seed');
}

bootstrap();
