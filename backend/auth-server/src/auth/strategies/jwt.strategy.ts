import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfigService } from 'src/config/jwt.config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtConfig: JwtConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.getAccessTokenOptions().secret,
    });
  }

  async validate(payload: { sub: string; roles: string[] }) {
    const user = await this.usersService.findByIdDocument(payload.sub);
    if (!user) throw new UnauthorizedException('유저를 찾을 수 없습니다.');

    // roles를 복원해서 리턴
    return {
      ...user.toObject(),
      roles: payload.roles,
    };
  }
}
