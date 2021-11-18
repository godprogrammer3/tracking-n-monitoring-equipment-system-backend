import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as admin from 'firebase-admin';
import { UsersService } from "./users.service";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private readonly UsersService,
    private reflector: Reflector) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    var roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('role', roles);
    const id = 1;
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

      if ( roles === undefined) {
        const actorDB = await this.UsersService.findByEmail(user.email);
        if (actorDB.id === id) {
          hasPermission = true;
          console.log('5555');
        }
        else {
          if (actorDB.role.role == 'super_admin') {
            hasPermission = true;
          }
          else if (actorDB.role.role == 'admin' || actorDB.role.role == 'master_maintainer') {
            const userDB = await this.UsersService.findById(id);
            if (actorDB.dept.id === userDB.dept.id) {
              hasPermission = true;
              console.log('654');
            }
          }
        }
      }
   /* const hasRole = roles.includes(user.role);
    if(hasRole) {
      if(user.role == 'super_admin') {
        hasPermission = true;
      }
      else {
        
      }
    }
    console.log('header',hasRole);*/


    return hasPermission;
  }
}