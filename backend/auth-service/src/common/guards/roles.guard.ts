import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 핸들러 또는 클래스에 정의된 Roles 메타데이터 조회
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    // 2. 요청 유저 정보에서 역할 가져오기
    const { user } = context.switchToHttp().getRequest();

    // 3. 권한 확인
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}
