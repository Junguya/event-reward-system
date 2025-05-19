import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtConfigService } from 'src/config/jwt.config';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

import { UserRes } from '../users/dto/user.res';
import { UserDocument } from '../users/schemas/user.schema';
import { RefreshTokenRes } from './dto/refresh-token.res';
import { SignInReq } from './dto/signin.req';
import { SignInRes } from './dto/signin.res';
import { SignUpReq } from './dto/signup.req';
import { LocalAuthGuard } from './strategies/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtConfig: JwtConfigService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입 (USER 역할 전용)' })
  @ApiBody({ type: SignUpReq })
  @ApiOkResponse({ type: UserRes })
  async signup(@Body() signUpReq: SignUpReq): Promise<UserRes> {
    return this.authService.signUp(signUpReq);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '로그인 (Access/Refresh 토큰 발급)' })
  @ApiBody({ type: SignInReq })
  @ApiOkResponse({ type: SignInRes })
  async signin(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<SignInRes> {
    if (!req.user) throw new UnauthorizedException('로그인 유저 정보가 없습니다.');

    return await this.authService.signIn(req.user as UserDocument);
  }

  @Post('signout')
  @ApiBearerAuth('access-token')
  @HttpCode(200)
  @ApiOperation({ summary: '로그아웃 (Refresh 토큰 무효화)' })
  async signout(@Body('refreshToken') refreshToken: string): Promise<void> {
    if (refreshToken) {
      await this.authService.revokeRefreshToken(refreshToken);
    }
  }

  @Post('token/refresh')
  @ApiBearerAuth('access-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Access Token 재발급' })
  @ApiBody({ schema: { example: { refreshToken: '...' } } })
  @ApiOkResponse({ type: RefreshTokenRes })
  async refresh(@Body('refreshToken') refreshToken: string): Promise<RefreshTokenRes> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token 누락');
    }

    return this.authService.reissueAccessToken(refreshToken);
  }
}
