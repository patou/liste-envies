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
exports.BaseRepository = void 0;
const datastore_1 = require("@google-cloud/datastore");
const common_1 = require("@nestjs/common");
let BaseRepository = class BaseRepository {
    datastore;
    kind;
    constructor(kind) {
        this.datastore = new datastore_1.Datastore();
        this.kind = kind;
    }
    createKey(id) {
        if (id) {
            return this.datastore.key([this.kind, id]);
        }
        return this.datastore.key(this.kind);
    }
    async save(data, id) {
        const key = this.createKey(id);
        const entity = {
            key: key,
            data: data,
        };
        await this.datastore.save(entity);
    }
    async get(id) {
        const key = this.createKey(id);
        const [entity] = await this.datastore.get(key);
        return entity;
    }
    async delete(id) {
        const key = this.createKey(id);
        await this.datastore.delete(key);
    }
    async getAll() {
        const query = this.datastore.createQuery(this.kind);
        const [entities] = await this.datastore.runQuery(query);
        return entities;
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], BaseRepository);
//# sourceMappingURL=base.repository.js.map