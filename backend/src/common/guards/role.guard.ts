import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        //mit reflector auf Metadata von handler zugreifen hier mit schlüssel Roles_key
        //hole dabei metadata für Klassen und Methodenebene
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        console.log('User object:', user);
        console.log('User role:', user?.role);

        if (!user || !user.role) {
            throw new ForbiddenException('Access denied!');
        }

        return requiredRoles.includes(user.role);
    }
}
