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
exports.WishListDto = exports.UserShareDto = exports.WishListState = exports.WishState = exports.WishListType = exports.WishListStatus = exports.UserShareType = exports.SharingPrivacyType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var SharingPrivacyType;
(function (SharingPrivacyType) {
    SharingPrivacyType["PRIVATE"] = "PRIVATE";
    SharingPrivacyType["OPEN"] = "OPEN";
    SharingPrivacyType["PUBLIC"] = "PUBLIC";
})(SharingPrivacyType || (exports.SharingPrivacyType = SharingPrivacyType = {}));
var UserShareType;
(function (UserShareType) {
    UserShareType["OWNER"] = "OWNER";
    UserShareType["SHARED"] = "SHARED";
})(UserShareType || (exports.UserShareType = UserShareType = {}));
var WishListStatus;
(function (WishListStatus) {
    WishListStatus["ACTIVE"] = "ACTIVE";
    WishListStatus["ARCHIVED"] = "ARCHIVED";
})(WishListStatus || (exports.WishListStatus = WishListStatus = {}));
var WishListType;
(function (WishListType) {
    WishListType["CHRISTMAS"] = "CHRISTMAS";
    WishListType["BIRTHDAY"] = "BIRTHDAY";
    WishListType["BIRTH"] = "BIRTH";
    WishListType["WEDDING"] = "WEDDING";
    WishListType["LEAVING"] = "LEAVING";
    WishListType["SPECIAL_OCCASION"] = "SPECIAL_OCCASION";
    WishListType["HOUSE_WARMING"] = "HOUSE_WARMING";
    WishListType["RETIREMENT"] = "RETIREMENT";
    WishListType["CEREMONY"] = "CEREMONY";
    WishListType["OTHER"] = "OTHER";
})(WishListType || (exports.WishListType = WishListType = {}));
var WishState;
(function (WishState) {
    WishState["DRAFT"] = "DRAFT";
    WishState["ACTIVE"] = "ACTIVE";
    WishState["ARCHIVED"] = "ARCHIVED";
    WishState["DELETED"] = "DELETED";
})(WishState || (exports.WishState = WishState = {}));
var WishListState;
(function (WishListState) {
    WishListState["OPEN"] = "OPEN";
    WishListState["CLOSED"] = "CLOSED";
})(WishListState || (exports.WishListState = WishListState = {}));
class UserShareDto {
    email;
    name;
    type;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, name: { required: false, type: () => String }, type: { required: true, enum: require("./wish-list.dto").UserShareType } };
    }
}
exports.UserShareDto = UserShareDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserShareDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserShareDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(UserShareType),
    __metadata("design:type", String)
], UserShareDto.prototype, "type", void 0);
class WishListDto {
    name;
    title;
    description;
    isOwner;
    users;
    owners;
    status;
    picture;
    type;
    date;
    privacy;
    forceAnonymous;
    state;
    canSuggest;
    counts;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, title: { required: true, type: () => String }, description: { required: false, type: () => String }, isOwner: { required: false, type: () => Boolean }, users: { required: false, type: () => [require("./wish-list.dto").UserShareDto] }, owners: { required: false, type: () => [require("./wish-list.dto").UserShareDto] }, status: { required: false, enum: require("./wish-list.dto").WishListStatus }, picture: { required: false, type: () => String }, type: { required: false, enum: require("./wish-list.dto").WishListType }, date: { required: false, type: () => Date }, privacy: { required: false, enum: require("./wish-list.dto").SharingPrivacyType }, forceAnonymous: { required: false, type: () => Boolean }, state: { required: false, enum: require("./wish-list.dto").WishListState }, canSuggest: { required: false, type: () => Boolean }, counts: { required: false, type: () => Object } };
    }
}
exports.WishListDto = WishListDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishListDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WishListDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishListDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishListDto.prototype, "isOwner", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UserShareDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WishListDto.prototype, "users", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UserShareDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WishListDto.prototype, "owners", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(WishListStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishListDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishListDto.prototype, "picture", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(WishListType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishListDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], WishListDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(SharingPrivacyType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishListDto.prototype, "privacy", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishListDto.prototype, "forceAnonymous", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishListDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishListDto.prototype, "canSuggest", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], WishListDto.prototype, "counts", void 0);
//# sourceMappingURL=wish-list.dto.js.map