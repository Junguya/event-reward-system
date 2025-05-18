import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { RefreshTokenRes } from './dto/refresh-token.res';
import { SignInReq } from './dto/signin.req';
import { SignInRes } from './dto/signin.res';
import { SignUpReq } from './dto/signup.req';

import { UserRes } from 'src/users/dto/user.res';
import { parseExpiryToMs } from '../common/utils/time.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: SignUpReq })
  @ApiOkResponse({ type: UserRes })
  signup(@Body() signUpReq: SignUpReq): Promise<UserRes> {
    return this.authService.signup(signUpReq);
  }

  @Post('signin')
  @ApiOperation({ summary: '로그인 (Access/Refresh 토큰 발급)' })
  @ApiBody({ type: SignInReq })
  @ApiOkResponse({ type: SignInRes })
  async signin(
    @Body() signInReq: SignInReq,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInRes> {
    const { accessToken, refreshToken, user } = await this.authService.signin(signInReq);
    const expiresIn = this.configService.get<string>('jwt.refreshToken.expiresIn') ?? '7d';
    const maxAge = parseExpiryToMs(expiresIn);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge,
    });

    return { accessToken, user };
  }

  @Post('signout')
  @HttpCode(200)
  @ApiOperation({ summary: '로그아웃 (Refresh 토큰 제거)' })
  async signout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return;

    const success = await this.authService.signout(refreshToken);
    if (!success) {
      throw new UnauthorizedException('유효하지 않은 refresh token입니다.');
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }

  @Post('token/refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Access Token 재발급' })
  @ApiOkResponse({ type: RefreshTokenRes })
  async refresh(@Req() req: Request): Promise<RefreshTokenRes> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token 누락');
    }

    return this.authService.reissueAccessToken(refreshToken);
  }
}
