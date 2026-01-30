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
import { WishRulesService } from '../../common/services/wish-rules.service';

@Injectable()
export class WishListService extends BaseRepository<any> {
  private wishRulesService: WishRulesService;

  constructor() {
    super('WishList');
    this.wishRulesService = new WishRulesService();
  }

  async list(user: any): Promise<WishListDto[]> {
    const email = user?.email || user;
    // Try querying all entities first to debug
    const allQuery = this.datastore.createQuery(this.kind);
    const [allEntities] = await this.datastore.runQuery(allQuery);

    // Filter manually for now to see the structure
    const filtered = allEntities.filter((entity) => {
      return entity.users?.some((u: any) => u.email === email);
    });

    const lists = filtered.map((e) => this.mapToDto(e));

    // Appliquer les règles de filtrage
    return this.wishRulesService.applyRulesToWishLists(user, lists);
  }

  async getAll(): Promise<WishListDto[]> {
    return (await super.getAll()).map((e) => this.mapToDto(e));
  }

  async getOrThrow(name: string, user?: any): Promise<WishListDto> {
    const entity = await this.get(name);
    if (!entity) throw new NotFoundException(`WishList ${name} not found`);
    const dto = this.mapToDto(entity);

    // Appliquer les règles de filtrage si un utilisateur est fourni
    if (user) {
      return this.wishRulesService.applyRulesToWishList(user, dto);
    }
    return dto;
  }

  /**
   * Récupère une liste sans appliquer les règles de filtrage
   * Utilisé en interne pour avoir les données complètes
   */
  async getUnfiltered(name: string): Promise<WishListDto> {
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
    const dto = this.mapToDto(list);

    // Vérifier si l'utilisateur peut rejoindre la liste
    if (!this.wishRulesService.canGive(dto, user.email, false)) {
      throw new ForbiddenException('Cannot join this list');
    }

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

    return this.wishRulesService.applyRulesToWishList(
      user,
      this.mapToDto(list),
    );
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
