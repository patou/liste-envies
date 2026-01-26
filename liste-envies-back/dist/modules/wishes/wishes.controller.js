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
exports.WishesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wishes_service_1 = require("./wishes.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const wish_dto_1 = require("./dto/wish.dto");
let WishesController = class WishesController {
    wishesService;
    constructor(wishesService) {
        this.wishesService = wishesService;
    }
    async getWishes(name, user) {
        return this.wishesService.list(user?.email, name);
    }
    async getWish(name, id, user) {
        return this.wishesService.getWish(user, name, parseInt(id));
    }
    async addWish(name, dto, user) {
        return this.wishesService.createOrUpdate(user, name, dto);
    }
    async updateWish(name, id, dto, user) {
        dto.id = parseInt(id);
        return this.wishesService.createOrUpdate(user, name, dto);
    }
    async giveWish(name, id, user) {
        return this.wishesService.give(user, name, parseInt(id));
    }
    async cancelGiveWish(name, id, user) {
        return this.wishesService.cancel(user, name, parseInt(id));
    }
    async addComment(name, id, comment, user) {
        return this.wishesService.addComment(user, name, parseInt(id), comment);
    }
    async deleteWish(name, id, user) {
        return this.wishesService.deleteWish(user, name, parseInt(id));
    }
};
exports.WishesController = WishesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List wishes for a user' }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/wish.dto").WishDto] }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WishesController.prototype, "getWishes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific wish' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/wish.dto").WishDto }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WishesController.prototype, "getWish", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a wish' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/wish.dto").WishDto }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, wish_dto_1.WishDto, Object]),
    __metadata("design:returntype", Promise)
], WishesController.prototype, "addWish", null);
__decorate([
    (0, common_1.Post)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update a wish' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/wish.dto").WishDto }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, wish_dto_1.WishDto, Object]),
    __metadata("design:returntype", Promise)
], WishesController.prototype, "updateWish", null);
__decorate([
    (0, common_1.Put)('give/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./dto/wish.dto").WishDto }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WishesController.prototype, "giveWish", null);
__decorate([
    (0, common_1.Delete)('give/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./dto/wish.dto").WishDto }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WishesController.prototype, "cancelGiveWish", null);
__decorate([
    (0, common_1.Post)(':id/addComment'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 201, type: require("./dto/wish.dto").WishDto }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, wish_dto_1.CommentDto, Object]),
    __metadata("design:returntype", Promise)
], WishesController.prototype, "addComment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WishesController.prototype, "deleteWish", null);
exports.WishesController = WishesController = __decorate([
    (0, swagger_1.ApiTags)('Wishes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('wishes/:name'),
    __metadata("design:paramtypes", [wishes_service_1.WishesService])
], WishesController);
//# sourceMappingURL=wishes.controller.js.map