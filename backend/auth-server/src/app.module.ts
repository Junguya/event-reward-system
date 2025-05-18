// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 다른 모듈에서 import 할 필요 없이 어디서나 사용 가능
      envFilePath: '.env',
    }),

    // 여기에 DB, User, Role, Auth 모듈 순으로 로드
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
  ],
})
export class AppModule {}
