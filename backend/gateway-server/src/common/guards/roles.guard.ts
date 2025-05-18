import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 데코레이터에 설정된 역할 정보 읽기
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. 역할 정보가 없으면 인증만 되면 통과
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    // 3. user 또는 roles 정보가 없으면 거부
    if (!user || !user.roles || !Array.isArray(user.roles)) return false;

    // 4. user.roles에 최소 하나라도 포함돼 있으면 통과
    return requiredRoles.some(role => user.roles.includes(role));
  }
}
