import { User } from "./user.entity";
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    MASTER_MAINTAINER = "master_maintainer",
    MAINTAINER = "maintainer",
    USER = "user"
}
export declare class Role {
    id: number;
    role: UserRole;
    permission: string;
    users: User[];
}
