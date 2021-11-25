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
exports.FirebaseStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const nestjs_firebase_auth_1 = require("@tfarras/nestjs-firebase-auth");
const nestjs_firebase_admin_1 = require("@tfarras/nestjs-firebase-admin");
let FirebaseStrategy = class FirebaseStrategy extends (0, passport_1.PassportStrategy)(nestjs_firebase_auth_1.FirebaseAuthStrategy, 'firebase') {
    constructor(firebaseAdmin) {
        super({
            extractor: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
        this.firebaseAdmin = firebaseAdmin;
    }
    async validate(user) {
        console.log('user:', user);
        console.log('phone number:', user.phone_number);
        return user;
    }
};
FirebaseStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nestjs_firebase_admin_1.FIREBASE_ADMIN_INJECT)),
    __metadata("design:paramtypes", [Object])
], FirebaseStrategy);
exports.FirebaseStrategy = FirebaseStrategy;
//# sourceMappingURL=firebase-auth.strategy.js.map