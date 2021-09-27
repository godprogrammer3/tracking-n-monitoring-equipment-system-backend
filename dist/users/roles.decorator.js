"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const Roles = (...roles) => {
    try {
        return (0, common_1.SetMetadata)('roles', roles);
    }
    catch (e) {
        console.error(e);
        return e;
    }
};
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map