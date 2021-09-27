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
exports.AuthenticationController = void 0;
const nest_sendgrid_1 = require("@anchan828/nest-sendgrid");
const common_1 = require("@nestjs/common");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const update_user_dto_1 = require("../users/dto/update-user.dto");
const authentication_service_1 = require("./authentication.service");
const authenttication_guard_1 = require("./authenttication.guard");
let AuthenticationController = class AuthenticationController {
    constructor(sendGrid, service) {
        this.sendGrid = sendGrid;
        this.service = service;
    }
    signIn(req, userDto) {
        return this.service.signIn(req.user, userDto.fcm_token);
    }
    register(createUserDto) {
        return this.service.register(createUserDto);
    }
    signout(req) {
        return this.service.signOut(req.user.email);
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
    sendNoti() {
        return this.service.sendNoti();
    }
};
__decorate([
    (0, common_1.UseGuards)(authenttication_guard_1.FirebaseAuthGuard),
    (0, common_1.Get)('/signin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "signIn", null);
__decorate([
    (0, common_1.UseGuards)(authenttication_guard_1.FirebaseAuthGuard),
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(authenttication_guard_1.FirebaseAuthGuard),
    (0, common_1.Get)('/signout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "signout", null);
__decorate([
    (0, common_1.Put)('send-mail'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "sendMail", null);
__decorate([
    (0, common_1.UseGuards)(authenttication_guard_1.FirebaseAuthGuard),
    (0, common_1.Get)('/send-noti'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "sendNoti", null);
AuthenticationController = __decorate([
    (0, common_1.Controller)('authen'),
    __metadata("design:paramtypes", [nest_sendgrid_1.SendGridService,
        authentication_service_1.AuthenticationService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map