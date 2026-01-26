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
exports.WishListService = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../../common/repository/base.repository");
const wish_list_dto_1 = require("./dto/wish-list.dto");
let WishListService = class WishListService extends base_repository_1.BaseRepository {
    constructor() {
        super('WishList');
    }
    async list(email) {
        const query = this.datastore.createQuery(this.kind).filter('users.email', '=', email);
        const [entities] = await this.datastore.runQuery(query);
        return entities.map(e => this.mapToDto(e));
    }
    async getAll() {
        return (await super.getAll()).map(e => this.mapToDto(e));
    }
    async getOrThrow(name) {
        const entity = await this.get(name);
        if (!entity)
            throw new common_1.NotFoundException(`WishList ${name} not found`);
        return this.mapToDto(entity);
    }
    async createOrUpdate(user, dto) {
        let name = dto.name;
        async function checkCollision(service, candidate) {
            if (await service.get(candidate)) {
                return checkCollision(service, `${name}-${Date.now()}`);
            }
            return candidate;
        }
        if (!name) {
            name = this.slugify(dto.title || `Liste de ${user.name || user.email}`);
            if (await this.get(name)) {
                name = `${name}-${Date.now()}`;
            }
        }
        let existing = await this.get(name);
        if (existing) {
            const isOwner = existing.users?.some((u) => u.email === user.email && u.type === wish_list_dto_1.UserShareType.OWNER) || user.isAdmin;
            if (!isOwner)
                throw new common_1.ForbiddenException('Not allowed to update this list');
        }
        else {
            const ownerShare = { email: user.email, name: user.name, type: wish_list_dto_1.UserShareType.OWNER };
            dto.users = [ownerShare];
            if (dto.owners) {
                dto.users.push(...dto.owners.map(o => ({ ...o, type: wish_list_dto_1.UserShareType.SHARED })));
            }
        }
        const entity = {
            name: name,
            title: dto.title || existing?.title,
            description: dto.description || existing?.description,
            picture: dto.picture || existing?.picture || 'img/default.jpg',
            type: dto.type || existing?.type || wish_list_dto_1.WishListType.OTHER,
            date: dto.date || existing?.date || new Date(),
            privacy: dto.privacy || existing?.privacy || wish_list_dto_1.SharingPrivacyType.PRIVATE,
            forceAnonymous: dto.forceAnonymous ?? existing?.forceAnonymous ?? false,
            status: dto.status || existing?.status || wish_list_dto_1.WishListStatus.ACTIVE,
            users: dto.users || existing?.users || [],
            counts: dto.counts || existing?.counts || {}
        };
        await this.save(entity, name);
        return this.mapToDto(entity);
    }
    async rename(user, name, newName) {
        const list = await this.get(name);
        if (!list)
            throw new common_1.NotFoundException();
        const isOwner = list.users?.some((u) => u.email === user.email && u.type === wish_list_dto_1.UserShareType.OWNER);
        if (!isOwner)
            throw new common_1.ForbiddenException();
        if (await this.get(newName))
            throw new common_1.ConflictException('New name already exists');
        const newList = { ...list, name: newName };
        await this.save(newList, newName);
        await this.delete(name);
    }
    async deleteList(user, name) {
        if (!user.isAdmin)
            throw new common_1.ForbiddenException();
        await this.delete(name);
    }
    async join(user, name) {
        const list = await this.get(name);
        if (!list)
            throw new common_1.NotFoundException();
        if (list.privacy === wish_list_dto_1.SharingPrivacyType.OPEN) {
            if (!list.users.some((u) => u.email === user.email)) {
                list.users.push({ email: user.email, name: user.name, type: wish_list_dto_1.UserShareType.SHARED });
                await this.save(list, name);
            }
        }
        return this.mapToDto(list);
    }
    mapToDto(entity) {
        return {
            name: entity.name || entity[this.datastore.KEY]?.name,
            title: entity.title,
            description: entity.description,
            picture: entity.picture,
            type: entity.type,
            date: entity.date,
            privacy: entity.privacy,
            forceAnonymous: entity.forceAnonymous,
            status: entity.status,
            users: entity.users,
            counts: entity.counts,
        };
    }
    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
};
exports.WishListService = WishListService;
exports.WishListService = WishListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WishListService);
//# sourceMappingURL=wish-list.service.js.map