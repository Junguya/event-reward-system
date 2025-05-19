import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [HttpModule],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
