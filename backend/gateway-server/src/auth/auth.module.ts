import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { JwtConfigService } from 'src/config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule], // axios 기반 요청 처리
  controllers: [AuthController],
  providers: [AuthService, JwtConfigService, JwtStrategy],
})
export class AuthModule {}
