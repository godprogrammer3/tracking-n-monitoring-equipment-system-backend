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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const nest_sendgrid_1 = require("@anchan828/nest-sendgrid");
const admin = require("firebase-admin");
const response_1 = require("../utils/response");
let UsersService = class UsersService {
    constructor(usersRepository, sendGrid) {
        this.usersRepository = usersRepository;
        this.sendGrid = sendGrid;
    }
    findAll() {
        return this.usersRepository.find();
    }
    findById(id) {
        return this.usersRepository.findOne({
            where: {
                id
            },
            relations: ['role', 'dept']
        });
    }
    async viewUser(id) {
        const users = await this.usersRepository.find({
            where: { id: (0, typeorm_2.In)(id) },
            relations: ['role', 'dept']
        });
        return new common_1.HttpException((0, response_1.getResponse)('00', users), common_1.HttpStatus.OK);
    }
    async findByEmail(email) {
        const user = await this.usersRepository.findOne({
            where: {
                email,
            },
            relations: ['role', 'dept']
        });
        return user;
    }
    async remove(id) {
        const user = await this.findById(id);
        const result = await admin.auth().getUserByEmail(user.email);
        await admin.auth().deleteUser(result.uid);
        await this.usersRepository.delete(id);
        return new common_1.HttpException((0, response_1.getResponse)('00', null), common_1.HttpStatus.OK);
    }
    async createUser(createUserDto) {
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }
    async createByAdmin(createByAdmin) {
        const user = this.usersRepository.create(createByAdmin);
        const result = this.usersRepository.merge(user, { status: "Approved" });
        console.log(result);
        return new common_1.HttpException((0, response_1.getResponse)('00', null), common_1.HttpStatus.OK);
    }
    async updateUser(id, updateUserDto) {
        return this.usersRepository.save(Object.assign(Object.assign({}, updateUserDto), { updated_by: 2, id: Number(id) }));
    }
    async findRole(id) {
        let result = await this.usersRepository.findOne({
            where: { id },
            relations: ['role'],
        });
        return (result.role.role);
    }
    async findByRole(role, dept_id) {
        const result = await this.usersRepository.find({
            relations: ['role', 'dept'],
            where: {
                role: {
                    role: (0, typeorm_2.In)(role)
                },
                dept: {
                    id: dept_id
                }
            }
        });
        return result;
    }
    async approve(id, actorId) {
        const user = await this.usersRepository.findOne({
            where: { id: id },
            relations: ['dept'],
        });
        if (user.status == 'WaitingForApprove') {
            this.usersRepository.update(id, { status: "Approved" });
            this.sendNotiToOne(user.fcm_token);
            this.sendMail(user.email);
            return new common_1.HttpException((0, response_1.getResponse)('00', null), common_1.HttpStatus.OK);
        }
        else {
            return new common_1.HttpException((0, response_1.getResponse)('05', null), common_1.HttpStatus.FORBIDDEN);
        }
    }
    async sendMail(email) {
        const result = await this.sendGrid.send({
            to: email,
            from: '6101013@kmitl.ac.th',
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        });
        return result;
    }
    async sendNotiToOne(token) {
        const message = {
            notification: {
                title: 'test',
                body: '12345'
            },
            token: token
        };
        admin.messaging().send(message)
            .then((response) => {
            console.log('Successfully sent message:', response);
        })
            .catch((error) => {
            console.log('Error sending message:', error);
        });
    }
    async block(id) {
        const user = await this.usersRepository.findOne({
            where: { id: id },
            relations: ['dept'],
        });
        if (user.status == 'Blocked') {
            return new common_1.HttpException((0, response_1.getResponse)('07', null), common_1.HttpStatus.FORBIDDEN);
        }
        else {
            this.updateUser(id, { 'status': 'Blocked' });
            return new common_1.HttpException((0, response_1.getResponse)('00', null), common_1.HttpStatus.OK);
        }
    }
    async unBlock(id) {
        const user = await this.usersRepository.findOne({
            where: { id: id },
            relations: ['dept'],
        });
        if (user.status == 'Blocked') {
            this.updateUser(id, { 'status': 'SignnedOut' });
            return new common_1.HttpException((0, response_1.getResponse)('00', null), common_1.HttpStatus.OK);
        }
        else {
            return new common_1.HttpException((0, response_1.getResponse)('06', null), common_1.HttpStatus.FORBIDDEN);
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        nest_sendgrid_1.SendGridService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map