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
    const body = request.body;
    console.log('id', id);
    const actorDB = await this.UsersService.findByEmail(user.email);
    if (roles === undefined) {
      if (actorDB.id == id && id.length == 1) {
        hasPermission = true;
        console.log('5555');
      }
      else if (actorDB.role.role == 'super_admin') {
        hasPermission = true;
        console.log('super');
      }
      else if (actorDB.role.role == 'admin') {
        let idConvertToNum = id.split(',').map(Number);
        for (let i = 0; i < idConvertToNum.length; i++) {
          let userDB = await this.UsersService.findById(idConvertToNum[i]);
          if (actorDB.dept.id == userDB.dept.id && (userDB.role.id == 2 || userDB.role.id == 5)) {
            hasPermission = true;
            console.log('admin');
          }
          else {
            hasPermission = false;
            break;
          }
        }
      }
      else if (actorDB.role.role == 'master_maintainer') {
        let idConvertToNum = id.split(',').map(Number);
        for (let i = 0; i < idConvertToNum.length; i++) {
          let userDB = await this.UsersService.findById(idConvertToNum[i]);
          if (actorDB.dept.id === userDB.dept.id && (userDB.role.id == 3 || userDB.role.id == 4)) {
            hasPermission = true;
            console.log('master');
          }
          else {
            hasPermission = false;
            break;
          }
        }
      }
    }
    else {
      let result = {
        role: body.role , 
        dept: body.dept
      };
      if (id != null) {
        const user = await this.UsersService.findById(id); 
        result.role = user.role.id;
        result.dept = user.dept.id;
        console.log('checkByParams',result);
      }
      if (actorDB.role.role == 'super_admin') {
        hasPermission = true;
        console.log('super');
      }
      else if (actorDB.role.role == 'admin') {
        if (actorDB.dept.id == result.dept && (result.role == 2 || result.role == 5)) {
          hasPermission = true;
          console.log('admin');
        }
      }
      else if (actorDB.role.role == 'master_maintainer') {
        if (actorDB.dept.id == result.dept && (result.role == 3 || result.role == 4)) {
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

