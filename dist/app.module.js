"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const nestjs_firebase_admin_1 = require("@tfarras/nestjs-firebase-admin");
const admin = require("firebase-admin");
const typeorm_1 = require("@nestjs/typeorm");
const nest_sendgrid_1 = require("@anchan828/nest-sendgrid");
const authentication_module_1 = require("./authentication/authentication.module");
const shared_module_1 = require("./shared/shared.module");
const department_module_1 = require("./department/department.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            users_module_1.UsersModule,
            nestjs_firebase_admin_1.FirebaseAdminModule.forRootAsync({
                useFactory: () => ({
                    credential: admin.credential.cert(process.env.FIREBASE_CREDENTIAL_PATH),
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: process.env.DB_TYPE,
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT) || 3306,
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                }),
            }),
            nest_sendgrid_1.SendGridModule.forRoot({
                apikey: process.env.SEND_GRID_ACCESS_KEY,
            }),
            authentication_module_1.AuthenticationModule,
            shared_module_1.SharedModule,
            department_module_1.DepartmentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map