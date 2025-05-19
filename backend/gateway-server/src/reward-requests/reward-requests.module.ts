import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RewardRequestsController } from './reward-requests.controller';
import { RewardRequestsService } from './reward-requests.service';

@Module({
  imports: [HttpModule],
  controllers: [RewardRequestsController],
  providers: [RewardRequestsService],
})
export class RewardRequestsModule {}
