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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../../common/repository/base.repository");
let UsersService = class UsersService extends base_repository_1.BaseRepository {
    constructor() {
        super('AppUser');
    }
    async getAll() {
        const entities = await super.getAll();
        return entities.map(e => this.mapToDto(e));
    }
    async findByEmail(email) {
        const entity = await this.get(email);
        if (!entity)
            return null;
        return this.mapToDto(entity);
    }
    async createOrUpdate(email, dto) {
        let existing = await this.get(email);
        const entity = {
            email: email,
            name: dto.name || existing?.name || '',
            picture: dto.picture || existing?.picture || '',
            birthday: dto.birthday || existing?.birthday || '',
            isAdmin: existing?.isAdmin || false
        };
        await this.save(entity, email);
        return this.mapToDto(entity);
    }
    mapToDto(entity) {
        return {
            email: entity.email,
            name: entity.name,
            picture: entity.picture,
            birthday: entity.birthday,
            isNewUser: !entity.name,
            isAdmin: entity.isAdmin
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UsersService);
//# sourceMappingURL=users.service.js.map