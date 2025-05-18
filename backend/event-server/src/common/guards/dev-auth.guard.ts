import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class DevAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = {
      _id: '6829f8c9679bd8c9ab3480ef',
      roles: ['ADMIN'], // 테스트 시 필요한 역할 넣기
    };
    return true;
  }
}
