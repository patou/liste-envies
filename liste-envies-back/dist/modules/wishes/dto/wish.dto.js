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
exports.WishDto = exports.CommentDto = exports.PersonParticipantDto = exports.PersonDto = exports.LinkDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const wish_list_dto_1 = require("../../wish-list/dto/wish-list.dto");
class LinkDto {
    url;
    static _OPENAPI_METADATA_FACTORY() {
        return { url: { required: true, type: () => String } };
    }
}
exports.LinkDto = LinkDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkDto.prototype, "url", void 0);
class PersonDto {
    id;
    email;
    name;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, email: { required: false, type: () => String }, name: { required: false, type: () => String } };
    }
}
exports.PersonDto = PersonDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PersonDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PersonDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PersonDto.prototype, "name", void 0);
class PersonParticipantDto {
    email;
    name;
    anonymous;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, name: { required: false, type: () => String }, anonymous: { required: false, type: () => Boolean } };
    }
}
exports.PersonParticipantDto = PersonParticipantDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonParticipantDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PersonParticipantDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PersonParticipantDto.prototype, "anonymous", void 0);
class CommentDto {
    text;
    date;
    author;
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: true, type: () => String }, date: { required: false, type: () => Date }, author: { required: true, type: () => require("./wish.dto").PersonDto } };
    }
}
exports.CommentDto = CommentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CommentDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CommentDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PersonDto),
    __metadata("design:type", PersonDto)
], CommentDto.prototype, "author", void 0);
class WishDto {
    id;
    listId;
    listTitle;
    owner;
    suggest;
    state;
    label;
    description;
    price;
    pictures;
    date;
    urls;
    userTake;
    given;
    userGiven;
    allreadyGiven;
    canEdit;
    canParticipate;
    canSuggest;
    comments;
    rating;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number }, listId: { required: false, type: () => String }, listTitle: { required: false, type: () => String }, owner: { required: false, type: () => require("./wish.dto").PersonDto }, suggest: { required: false, type: () => Boolean }, state: { required: false, enum: require("../../wish-list/dto/wish-list.dto").WishState }, label: { required: true, type: () => String }, description: { required: false, type: () => String }, price: { required: false, type: () => String }, pictures: { required: false, type: () => [String] }, date: { required: false, type: () => Date }, urls: { required: false, type: () => [require("./wish.dto").LinkDto] }, userTake: { required: false, type: () => [require("./wish.dto").PersonParticipantDto] }, given: { required: false, type: () => Boolean }, userGiven: { required: false, type: () => Boolean }, allreadyGiven: { required: false, type: () => Boolean }, canEdit: { required: false, type: () => Boolean }, canParticipate: { required: false, type: () => Boolean }, canSuggest: { required: false, type: () => Boolean }, comments: { required: false, type: () => [require("./wish.dto").CommentDto] }, rating: { required: false, type: () => Number } };
    }
}
exports.WishDto = WishDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WishDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishDto.prototype, "listId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishDto.prototype, "listTitle", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PersonDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PersonDto)
], WishDto.prototype, "owner", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishDto.prototype, "suggest", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(wish_list_dto_1.WishState),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WishDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WishDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WishDto.prototype, "pictures", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], WishDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => LinkDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WishDto.prototype, "urls", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PersonParticipantDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WishDto.prototype, "userTake", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishDto.prototype, "given", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishDto.prototype, "userGiven", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishDto.prototype, "allreadyGiven", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishDto.prototype, "canEdit", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishDto.prototype, "canParticipate", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WishDto.prototype, "canSuggest", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CommentDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WishDto.prototype, "comments", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WishDto.prototype, "rating", void 0);
//# sourceMappingURL=wish.dto.js.map