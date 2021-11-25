"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const admin = require("firebase-admin");
const users_service_1 = require("./users.service");
let RolesGuard = class RolesGuard {
    constructor(UsersService, reflector) {
        this.UsersService = UsersService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        var roles = this.reflector.get('roles', context.getHandler());
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
        });
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
            else if (actorDB.role.role == 'admin') {
                const userDB = await this.UsersService.findById(id);
                if (actorDB.dept.id === userDB.dept.id && userDB.role.id != 1) {
                    hasPermission = true;
                    console.log('admin');
                }
            }
            else if (actorDB.role.role == 'master_maintainer') {
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
            else if (actorDB.role.role == 'admin') {
                const userDB = await this.UsersService.findById(id);
                if (actorDB.dept.id == userDB.dept.id && userDB.role.id != 1) {
                    hasPermission = true;
                    console.log('admin');
                }
            }
            else if (actorDB.role.role == 'master_maintainer') {
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
};
RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(users_service_1.UsersService)),
    __metadata("design:paramtypes", [Object, core_1.Reflector])
], RolesGuard);
exports.RolesGuard = RolesGuard;
//# sourceMappingURL=roles.guard.js.map