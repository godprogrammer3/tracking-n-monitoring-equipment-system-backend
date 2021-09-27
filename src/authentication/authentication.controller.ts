import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { FirebaseAuthGuard } from "./authenttication.guard";
import { UsersService } from "src/users/users.service";

@Controller()
export class AuthenticationController {
    constructor(private readonly usersService: UsersService) {}
    @UseGuards(FirebaseAuthGuard)
     @Get('/hello')
     getAll() {
        return this.usersService.findAll();
      }
}