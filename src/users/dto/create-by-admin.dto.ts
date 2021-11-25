import { IsNotEmpty } from "class-validator";
import { Role } from "../entities/role.entity";

export class CreateByAdmin {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    role: Role;
}