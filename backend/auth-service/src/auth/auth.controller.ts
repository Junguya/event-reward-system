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
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { parseExpiryToMs } from 'src/common/utils/time.util';
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

    const refreshExpires = this.jwtConfig.getRefreshTokenOptions().expiresIn;
    const maxAge = parseExpiryToMs(refreshExpires);

    const { accessToken, refreshToken, user } = await this.authService.signIn(
      req.user as UserDocument,
    );

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
  @ApiOperation({ summary: '로그아웃 (Refresh 토큰 무효화)' })
  async signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await this.authService.revokeRefreshToken(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Access Token 재발급' })
  @ApiOkResponse({ type: RefreshTokenRes })
  async refresh(@Req() req: Request): Promise<RefreshTokenRes> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('Refresh Token 누락');

    return this.authService.refreshTokens(refreshToken);
  }
}
