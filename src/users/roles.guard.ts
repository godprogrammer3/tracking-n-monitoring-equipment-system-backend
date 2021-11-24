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

    const id = request.params.id;
    console.log('id', id);
    const actorDB = await this.UsersService.findByEmail(user.email);
    if (roles === undefined) {
      if (actorDB.id == id) {
        hasPermission = true;
        console.log('5555');
      }
      else if (actorDB.role.role == 'super_admin') {
        hasPermission = true;
        console.log('super');
      }
      else if (actorDB.role.role == 'admin' ) {
        const userDB = await this.UsersService.findById(id);
        if (actorDB.dept.id === userDB.dept.id && userDB.role.id != 1) {
          hasPermission = true;
          console.log('admin');
        }
      }
      else if (actorDB.role.role == 'master_maintainer'){
        const userDB = await this.UsersService.findById(id);
        if (actorDB.dept.id === userDB.dept.id && (userDB.role.id == 3 || userDB.role.id == 4)) {
          hasPermission = true;
          console.log('master');
        }
      }
    }
    else {
      if (actorDB.role.role == 'super_admin') {
        hasPermission = true;
        console.log('super');
      }
      else if (actorDB.role.role == 'admin' ) {
        const userDB = await this.UsersService.findById(id);
        if (actorDB.dept.id == userDB.dept.id && userDB.role.id != 1) {
          hasPermission = true;
          console.log('admin');
        }
      }
      else if (actorDB.role.role == 'master_maintainer'){
        const userDB = await this.UsersService.findById(id);
        if (actorDB.dept.id === userDB.dept.id && (userDB.role.id == 3 || userDB.role.id == 4)) {
          hasPermission = true;
          console.log('master');
        }
      }
    }
    request.actor = actorDB; 
    console.log('permission', hasPermission);

    return hasPermission;
  }
}

/*async function checkPermission (id: number, actorDB: any) {

  let hasPermission = false;
  if (actorDB.role.role == 'super_admin') {
    hasPermission = true;
    console.log('super');
  }
  else if (actorDB.role.role == 'admin' ) {
    const userDB = await this.UsersService.findById(id);
    if (actorDB.dept.id === userDB.dept.id && userDB.role.id != 1) {
      hasPermission = true;
      console.log('admin');
    }
  }
  else if (actorDB.role.role == 'master_maintainer'){
    const userDB = await this.UsersService.findById(id);
    if (actorDB.dept.id === userDB.dept.id && (userDB.role.id == 3 || userDB.role.id == 4)) {
      hasPermission = true;
      console.log('master');
    }
  }
  return hasPermission;
}*/