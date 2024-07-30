import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';

import { Request } from 'express';

@Injectable()
export class InviteGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const inviteToken = request.cookies['invite_token'];

        if (!inviteToken) {
            throw new ForbiddenException('Access denied!');
        }
        return true;
    }
}
