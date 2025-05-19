import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { JwtConfigService } from './config/jwt.config';
import { EventsModule } from './events/events.module';
import { RewardRequestsModule } from './reward-requests/reward-requests.module';
import { RewardsModule } from './rewards/rewards.module';
import { RolesModule } from './roles/roles.module';
import { UserStatsModule } from './user-stats/user-stats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Gateway는 DB대신 HTTP 통신 모듈 필요
    HttpModule.register({ timeout: 5000 }),

    // 프록시용 모듈들 등록
    UsersModule,
    AuthModule,
    RolesModule,
    EventsModule,
    RewardsModule,
    RewardRequestsModule,
    UserStatsModule,
  ],
  providers: [JwtConfigService],
  exports: [JwtConfigService],
})
export class AppModule {}
