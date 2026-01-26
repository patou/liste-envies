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
exports.WishListController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wish_list_service_1 = require("./wish-list.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const wish_list_dto_1 = require("./dto/wish-list.dto");
let WishListController = class WishListController {
    wishListService;
    constructor(wishListService) {
        this.wishListService = wishListService;
    }
    async getWishListForUser(user) {
        if (user) {
            return this.wishListService.list(user.email);
        }
        return [];
    }
    async getWishListForOtherUser(email) {
        return this.wishListService.list(email);
    }
    async getAllList(user) {
        if (!user.isAdmin)
            throw new Error('Not Allowed');
        return this.wishListService.getAll();
    }
    async updateWishList(name, dto, user) {
        dto.name = name;
        return this.wishListService.createOrUpdate(user, dto);
    }
    async addWishList(dto, user) {
        return this.wishListService.createOrUpdate(user, dto);
    }
    async renameWishList(name, newName, user) {
        return this.wishListService.rename(user, name, newName);
    }
    async getOneWishList(name) {
        return this.wishListService.getOrThrow(name);
    }
    async join(name, user) {
        return this.wishListService.join(user, name);
    }
    async deleteWishList(name, user) {
        return this.wishListService.deleteList(user, name);
    }
};
exports.WishListController = WishListController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user wish lists' }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/wish-list.dto").WishListDto] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "getWishListForUser", null);
__decorate([
    (0, common_1.Get)('of/:email'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get wish lists of another user' }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/wish-list.dto").WishListDto] }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "getWishListForOtherUser", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 200, type: [require("./dto/wish-list.dto").WishListDto] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "getAllList", null);
__decorate([
    (0, common_1.Post)(':name'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 201, type: require("./dto/wish-list.dto").WishListDto }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, wish_list_dto_1.WishListDto, Object]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "updateWishList", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a wish list' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/wish-list.dto").WishListDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wish_list_dto_1.WishListDto, Object]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "addWishList", null);
__decorate([
    (0, common_1.Put)(':name/:newName'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('newName')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "renameWishList", null);
__decorate([
    (0, common_1.Get)(':name'),
    openapi.ApiResponse({ status: 200, type: require("./dto/wish-list.dto").WishListDto }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "getOneWishList", null);
__decorate([
    (0, common_1.Get)(':name/join'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./dto/wish-list.dto").WishListDto }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "join", null);
__decorate([
    (0, common_1.Delete)(':name'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "deleteWishList", null);
exports.WishListController = WishListController = __decorate([
    (0, swagger_1.ApiTags)('WishList'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('list'),
    __metadata("design:paramtypes", [wish_list_service_1.WishListService])
], WishListController);
//# sourceMappingURL=wish-list.controller.js.map