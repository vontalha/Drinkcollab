// src/auth/no-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class NoAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    if (request.cookies && request.cookies.access_token) {
        throw new ForbiddenException('Access denied for authenticated users');
    }
    return true;
  }
}

