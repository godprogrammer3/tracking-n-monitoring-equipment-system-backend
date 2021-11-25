import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
export declare class RolesGuard implements CanActivate {
    private readonly UsersService;
    private reflector;
    constructor(UsersService: any, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
