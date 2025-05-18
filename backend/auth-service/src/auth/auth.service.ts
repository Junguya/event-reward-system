import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { parseExpiryToMs } from 'src/common/utils/time.util';
import { JwtConfigService } from '../config/jwt.config';
import { UserRes } from '../users/dto/user.res';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { RefreshTokenRes } from './dto/refresh-token.res';
import { SignInRes } from './dto/signin.res';
import { SignUpReq } from './dto/signup.req';
import { RefreshToken, RefreshTokenDocument } from './schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly jwtConfig: JwtConfigService,

    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('존재하지 않는 이메일입니다.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return user;
  }

  async signUp(req: SignUpReq): Promise<UserRes> {
    const createUserDto = {
      ...req,
      roles: ['USER'],
    };
    return this.usersService.create(createUserDto);
  }

  async signIn(user: UserDocument): Promise<SignInRes & { refreshToken: string }> {
    const populatedUser = await this.usersService.findById(user._id);
    if (!populatedUser) {
      throw new UnauthorizedException('사용자 정보를 불러올 수 없습니다.');
    }

    const roleCodes = (populatedUser.roles as any[]).map(r => r.code);
    const roleNames = (populatedUser.roles as any[]).map(role => role.name);

    const payload = {
      sub: populatedUser.id, // 이미 transform된 id임
      roles: roleCodes,
    };

    const accessToken = this.jwtService.sign(payload, this.jwtConfig.getAccessTokenOptions());
    const refreshToken = this.jwtService.sign(payload, this.jwtConfig.getRefreshTokenOptions());

    const expiresInMs = parseExpiryToMs(this.jwtConfig.getRefreshTokenOptions().expiresIn);

    await this.refreshTokenModel.findOneAndUpdate(
      { user: populatedUser.id },
      {
        token: refreshToken,
        expiresAt: new Date(Date.now() + expiresInMs),
        isRevoked: false,
      },
      { upsert: true, new: true },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: populatedUser.id,
        email: populatedUser.email,
        name: populatedUser.name,
        gender: populatedUser.gender,
        roles: roleNames,
      },
    };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenModel.findOneAndUpdate({ token }, { isRevoked: true });
  }

  async refreshTokens(refreshToken: string): Promise<RefreshTokenRes> {
    const savedToken = await this.refreshTokenModel.findOne({ token: refreshToken });

    if (!savedToken || savedToken.isRevoked) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    if (savedToken.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }

    const user = await this.usersService.findById(savedToken.user.toString());
    if (!user) throw new UnauthorizedException('사용자를 찾을 수 없습니다.');

    const roleNames = (user.roles as any[]).map(role => role.name);

    const payload = {
      sub: user.id,
      roles: roleNames,
    };

    const accessToken = this.jwtService.sign(payload, this.jwtConfig.getAccessTokenOptions());

    return { accessToken };
  }
}
