import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [HttpModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
