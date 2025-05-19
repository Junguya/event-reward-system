import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { UserStatsController } from './user-stats.controller';
import { UserStatsService } from './user-stats.service';

@Module({
  imports: [HttpModule],
  controllers: [UserStatsController],
  providers: [UserStatsService],
})
export class UserStatsModule {}
