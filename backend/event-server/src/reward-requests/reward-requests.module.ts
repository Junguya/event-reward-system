import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { RewardRequestsController } from './reward-requests.controller';
import { RewardRequestsService } from './reward-requests.service';

import { Event, EventSchema } from 'src/events/schemas/event.schema';
import { Reward, RewardSchema } from 'src/rewards/schemas/reward.schema';
import { UserStats, UserStatsSchema } from 'src/user-stats/schemas/user-stats.schema';
import { RewardRequest, RewardRequestSchema } from './schemas/reward-request.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule,

    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: UserStats.name, schema: UserStatsSchema },
    ]),
  ],
  controllers: [RewardRequestsController],
  providers: [RewardRequestsService],
})
export class RewardRequestsModule {}
