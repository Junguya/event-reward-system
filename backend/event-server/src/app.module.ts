import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './common/strategies/jwt.strategy';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { RewardRequestsModule } from './reward-requests/reward-requests.module';
import { RewardsModule } from './rewards/rewards.module';
import { UserStatsModule } from './user-stats/user-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),

    EventsModule,
    RewardsModule,
    RewardRequestsModule,
    UserStatsModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
