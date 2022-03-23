import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as admin from 'firebase-admin';
import { UsersService } from "src/users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private readonly UsersService,
    private reflector: Reflector) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    var roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('role', roles);
    let user;
    let hasPermission = false;
    const request = context.switchToHttp().getRequest();

    const headerAuthorization = request.headers.authorization;
    if (!headerAuthorization) {
      return false;
    }
    const authToken = headerAuthorization.substring(7, headerAuthorization.length);
    console.log(authToken);
    await admin.auth().verifyIdToken(authToken)
      .then((decodedToken) => {
        user = decodedToken;
      })
      .catch((error) => {
        console.log(error);
      })
      const actorDB = await this.UsersService.findByEmail(user.email);
      const permissionFound = roles.includes(actorDB.role.role)
      if (permissionFound) {
          hasPermission = true;
      }

      request.actor = actorDB;
      return hasPermission;
    }
}