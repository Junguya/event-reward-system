import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RewardRequestsController } from 'src/reward-requests/reward-requests.controller';
import { RewardRequestsService } from 'src/reward-requests/reward-requests.service';

@Module({
  imports: [HttpModule],
  controllers: [RewardRequestsController],
  providers: [RewardRequestsService],
})
export class RewardRequestsModule {}
