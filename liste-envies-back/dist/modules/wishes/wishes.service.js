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
exports.WishesService = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../../common/repository/base.repository");
const wish_list_dto_1 = require("../wish-list/dto/wish-list.dto");
const wish_dto_1 = require("./dto/wish.dto");
const wish_list_service_1 = require("../wish-list/wish-list.service");
let WishesService = class WishesService extends base_repository_1.BaseRepository {
    wishListService;
    constructor(wishListService) {
        super('Wish');
        this.wishListService = wishListService;
    }
    async list(email, listName, state = wish_list_dto_1.WishState.ACTIVE) {
        const listKey = this.datastore.key(['WishList', listName]);
        const query = this.datastore.createQuery('Wish').hasAncestor(listKey);
        if (state) {
            query.filter('state', '=', state);
        }
        const [entities] = await this.datastore.runQuery(query);
        return entities.map(e => this.mapToDto(e));
    }
    async getWish(user, listName, wishId) {
        const key = this.datastore.key(['WishList', listName, 'Wish', this.datastore.int(wishId)]);
        const [entity] = await this.datastore.get(key);
        if (!entity)
            throw new common_1.NotFoundException();
        return this.mapToDto(entity);
    }
    async createOrUpdate(user, listName, dto) {
        const listKey = this.datastore.key(['WishList', listName]);
        let key;
        if (dto.id) {
            key = this.datastore.key(['WishList', listName, 'Wish', this.datastore.int(dto.id)]);
        }
        else {
            key = this.datastore.key(['WishList', listName, 'Wish']);
        }
        const entity = {
            key: key,
            data: {
                label: dto.label,
                description: dto.description,
                state: dto.state || wish_list_dto_1.WishState.ACTIVE,
                date: new Date(),
                owner: { email: user.email, name: user.name },
                list: listKey,
                rating: dto.rating || 0,
                pictures: dto.pictures || [],
                urls: dto.urls || [],
                suggest: dto.suggest || false,
                userTake: dto.userTake || [],
                comments: dto.comments || []
            }
        };
        await this.datastore.save(entity);
        const [saved] = await this.datastore.get(key);
        return this.mapToDto(saved);
    }
    async give(user, listName, wishId) {
        const key = this.datastore.key(['WishList', listName, 'Wish', this.datastore.int(wishId)]);
        const [wish] = await this.datastore.get(key);
        if (!wish)
            throw new common_1.NotFoundException();
        if (!wish.userTake)
            wish.userTake = [];
        wish.userTake.push({ email: user.email, name: user.name });
        await this.datastore.save({ key, data: wish });
        return this.mapToDto(wish);
    }
    async cancel(user, listName, wishId) {
        const key = this.datastore.key(['WishList', listName, 'Wish', this.datastore.int(wishId)]);
        const [wish] = await this.datastore.get(key);
        if (!wish)
            throw new common_1.NotFoundException();
        if (wish.userTake) {
            wish.userTake = wish.userTake.filter((u) => u.email !== user.email);
        }
        await this.datastore.save({ key, data: wish });
        return this.mapToDto(wish);
    }
    async addComment(user, listName, wishId, comment) {
        const key = this.datastore.key(['WishList', listName, 'Wish', this.datastore.int(wishId)]);
        const [wish] = await this.datastore.get(key);
        if (!wish)
            throw new common_1.NotFoundException();
        if (!wish.comments)
            wish.comments = [];
        wish.comments.push({ ...comment, author: { email: user.email, name: user.name }, date: new Date() });
        await this.datastore.save({ key, data: wish });
        return this.mapToDto(wish);
    }
    async deleteWish(user, listName, wishId) {
        const key = this.datastore.key(['WishList', listName, 'Wish', this.datastore.int(wishId)]);
        await this.datastore.delete(key);
    }
    mapToDto(entity) {
        const dto = new wish_dto_1.WishDto();
        dto.id = entity[this.datastore.KEY]?.id ? parseInt(entity[this.datastore.KEY].id) : undefined;
        dto.label = entity.label;
        dto.description = entity.description;
        dto.state = entity.state;
        dto.owner = entity.owner;
        dto.date = entity.date;
        dto.pictures = entity.pictures;
        dto.urls = entity.urls;
        dto.rating = entity.rating;
        dto.userTake = entity.userTake;
        dto.comments = entity.comments;
        return dto;
    }
};
exports.WishesService = WishesService;
exports.WishesService = WishesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [wish_list_service_1.WishListService])
], WishesService);
//# sourceMappingURL=wishes.service.js.map