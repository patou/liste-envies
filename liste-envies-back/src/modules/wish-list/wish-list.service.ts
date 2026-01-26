import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { BaseRepository } from '../../common/repository/base.repository';
import {
  WishListDto,
  UserShareDto,
  SharingPrivacyType,
  UserShareType,
  WishListType,
  WishListStatus,
  WishState,
} from './dto/wish-list.dto';
import { Datastore } from '@google-cloud/datastore';

@Injectable()
export class WishListService extends BaseRepository<any> {
  constructor() {
    super('WishList');
  }

  async list(email: string): Promise<WishListDto[]> {
    const query = this.datastore
      .createQuery(this.kind)
      .filter('users.email', '=', email);
    const [entities] = await this.datastore.runQuery(query);
    return entities.map((e) => this.mapToDto(e));
  }

  async getAll(): Promise<WishListDto[]> {
    return (await super.getAll()).map((e) => this.mapToDto(e));
  }

  async getOrThrow(name: string): Promise<WishListDto> {
    const entity = await this.get(name);
    if (!entity) throw new NotFoundException(`WishList ${name} not found`);
    return this.mapToDto(entity);
  }

  async createOrUpdate(user: any, dto: WishListDto): Promise<WishListDto> {
    let name = dto.name;

    async function checkCollision(
      service: WishListService,
      candidate: string,
    ): Promise<string> {
      if (await service.get(candidate)) {
        return checkCollision(service, `${name}-${Date.now()}`); // Simple retry strategy
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
      const isOwner =
        existing.users?.some(
          (u: UserShareDto) =>
            u.email === user.email && u.type === UserShareType.OWNER,
        ) || user.isAdmin;
      if (!isOwner)
        throw new ForbiddenException('Not allowed to update this list');
    } else {
      const ownerShare: UserShareDto = {
        email: user.email,
        name: user.name,
        type: UserShareType.OWNER,
      };
      dto.users = [ownerShare];
      if (dto.owners) {
        dto.users.push(
          ...dto.owners.map((o) => ({ ...o, type: UserShareType.SHARED })),
        );
      }
    }

    const entity = {
      name: name,
      title: dto.title || existing?.title,
      description: dto.description || existing?.description,
      picture: dto.picture || existing?.picture || 'img/default.jpg',
      type: dto.type || existing?.type || WishListType.OTHER,
      date: dto.date || existing?.date || new Date(),
      privacy: dto.privacy || existing?.privacy || SharingPrivacyType.PRIVATE,
      forceAnonymous: dto.forceAnonymous ?? existing?.forceAnonymous ?? false,
      status: dto.status || existing?.status || WishListStatus.ACTIVE,
      users: dto.users || existing?.users || [],
      counts: dto.counts || existing?.counts || {},
    };

    await this.save(entity, name);
    return this.mapToDto(entity);
  }

  async rename(user: any, name: string, newName: string) {
    const list = await this.get(name);
    if (!list) throw new NotFoundException();
    const isOwner = list.users?.some(
      (u: UserShareDto) =>
        u.email === user.email && u.type === UserShareType.OWNER,
    );
    if (!isOwner) throw new ForbiddenException();

    if (await this.get(newName))
      throw new ConflictException('New name already exists');

    const newList = { ...list, name: newName };
    await this.save(newList, newName);
    await this.delete(name);
  }

  async deleteList(user: any, name: string) {
    if (!user.isAdmin) throw new ForbiddenException();
    await this.delete(name);
  }

  async join(user: any, name: string) {
    const list = await this.get(name);
    if (!list) throw new NotFoundException();
    if (list.privacy === SharingPrivacyType.OPEN) {
      if (!list.users.some((u: UserShareDto) => u.email === user.email)) {
        list.users.push({
          email: user.email,
          name: user.name,
          type: UserShareType.SHARED,
        });
        await this.save(list, name);
      }
    }
    return this.mapToDto(list);
  }

  private mapToDto(entity: any): WishListDto {
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

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
