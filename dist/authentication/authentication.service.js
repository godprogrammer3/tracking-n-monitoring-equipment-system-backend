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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const nest_sendgrid_1 = require("@anchan828/nest-sendgrid");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const response_1 = require("../utils/response");
const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase.config.json");
let AuthenticationService = class AuthenticationService {
    constructor(usersService, sendGrid) {
        this.usersService = usersService;
        this.sendGrid = sendGrid;
    }
    validateUser(username, pass) {
        console.log("validateUser");
        return true;
    }
    async signIn(user, fcm_token) {
        if (!user['email_verified']) {
            throw new common_1.HttpException((0, response_1.getResponse)('02', null), common_1.HttpStatus.FORBIDDEN);
        }
        var result = await this.usersService.findByEmail(user['email']);
        if (!result) {
            throw new common_1.HttpException((0, response_1.getResponse)('03', null), common_1.HttpStatus.FORBIDDEN);
        }
        if (result.status == 'Approved') {
            const userRole = await this.usersService.findRole(result.id);
            await admin.auth().setCustomUserClaims(user['uid'], {
                "role": userRole
            });
            const re = await admin.auth().getUser(user['uid']);
            await this.usersService.updateUser(result.id, { "status": "Signingin", "fcm_token": fcm_token });
            result = await this.usersService.findById(result.id);
            throw new common_1.HttpException((0, response_1.getResponse)('00', result), common_1.HttpStatus.OK);
        }
        else if (result.status == 'SignedOut') {
            await this.usersService.updateUser(result.id, { "status": "Signingin", "fcm_token": fcm_token });
            result = await this.usersService.findById(result.id);
            throw new common_1.HttpException((0, response_1.getResponse)('00', result), common_1.HttpStatus.OK);
        }
        else
            throw new common_1.HttpException((0, response_1.getResponse)('04', null), common_1.HttpStatus.FORBIDDEN);
    }
    async register(userDto) {
        var result = await this.usersService.findByEmail(userDto.email);
        console.log(result);
        if (result) {
            if (result.status == 'Approved') {
                this.usersService.updateUser(result.id, userDto);
                result = await this.usersService.findById(result.id);
                console.log('response', (0, response_1.getResponse)('00', result));
                throw new common_1.HttpException((0, response_1.getResponse)('00', result), common_1.HttpStatus.OK);
            }
        }
        else {
            const user = await this.usersService.createUser(userDto);
            this.usersService.updateUser(user.id, { "status": "WaitingForValidateEmail" });
            result = await this.usersService.findById(user.id);
            const getAdmin = await this.usersService.findByRole(['super_admin', 'admin'], result.dept.id);
            console.log('admin', getAdmin);
            const tokens = getAdmin.map(token => token.fcm_token);
            console.log('tokens', tokens);
            const message = {
                notification: {
                    title: 'test',
                    body: '12345'
                },
                tokens: tokens
            };
            admin.messaging().sendMulticast(message)
                .then((response) => {
                console.log('Successfully sent message:', response);
            })
                .catch((error) => {
                console.log('Error sending message:', error);
            });
            throw new common_1.HttpException((0, response_1.getResponse)('00', user), common_1.HttpStatus.OK);
        }
    }
    async signOut(email) {
        const result = await this.usersService.findByEmail(email);
        this.usersService.updateUser(result.id, { "status": "SignedOut", "fcm_token": null });
        throw new common_1.HttpException((0, response_1.getResponse)('00', null), common_1.HttpStatus.OK);
    }
    async sendMail() {
        const result = await this.sendGrid.send({
            to: 'supreeyafon22@gmail.com',
            from: '61010103@kmitl.ac.th',
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        });
        return result;
    }
    async sendNoti() {
        const user = await this.usersService.findById(4);
        console.log("department", user.dept.id);
        const getAdmin = await this.usersService.findByRole(['super_admin', 'admin'], user.dept.id);
        console.log('admin', getAdmin);
        const tokens = getAdmin.map(token => token.fcm_token);
        console.log('tokens', tokens);
        const message = {
            notification: {
                title: 'test',
                body: '12345'
            },
            tokens: tokens
        };
        admin.messaging().sendMulticast(message)
            .then((response) => {
            console.log('Successfully sent message:', response.successCount);
        })
            .catch((error) => {
            console.log('Error sending message:', error);
        });
    }
};
AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        nest_sendgrid_1.SendGridService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map