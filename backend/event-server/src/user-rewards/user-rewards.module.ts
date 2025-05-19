import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponsModule } from 'src/coupons/coupons.module';
import { UserStatsModule } from 'src/user-stats/user-stats.module';
import { UserReward, UserRewardSchema } from './schemas/user-rewards.schema';
import { UserRewardsService } from './user-rewards.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserReward.name, schema: UserRewardSchema }]),
    CouponsModule,
    UserStatsModule,
  ],
  providers: [UserRewardsService],
  exports: [UserRewardsService],
})
export class UserRewardsModule {}
