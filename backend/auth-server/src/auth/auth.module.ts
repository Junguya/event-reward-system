import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalAuthGuard } from './strategies/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';

import { HttpModule } from '@nestjs/axios';
import { JwtConfigService } from '../config/jwt.config';
import { UsersModule } from '../users/users.module';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
    UsersModule,
    HttpModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtConfigService, LocalStrategy, LocalAuthGuard, JwtStrategy],
})
export class AuthModule {}
