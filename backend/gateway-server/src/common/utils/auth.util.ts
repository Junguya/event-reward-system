import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export function extractAccessToken(req: Request): string {
  const rawHeader = req.headers.authorization;
  if (!rawHeader) throw new UnauthorizedException('Access Token 누락');

  return rawHeader.replace('Bearer ', '');
}
