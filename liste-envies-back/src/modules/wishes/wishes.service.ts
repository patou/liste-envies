import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { BaseRepository } from '../../common/repository/base.repository';
import { WishState } from '../wish-list/dto/wish-list.dto';
import { WishDto, CommentDto } from './dto/wish.dto';
import { WishListService } from '../wish-list/wish-list.service';
import { Datastore } from '@google-cloud/datastore';
import { WishRulesService } from '../../common/services/wish-rules.service';

@Injectable()
export class WishesService extends BaseRepository<any> {
  private wishRulesService: WishRulesService;

  constructor(private readonly wishListService: WishListService) {
    super('Wish');
    this.wishRulesService = new WishRulesService();
  }

  async list(
    user: any,
    listName: string,
    state: WishState = WishState.ACTIVE,
  ): Promise<WishDto[]> {
    const listKey = this.datastore.key(['WishList', listName]);
    const query = this.datastore.createQuery('Wish').hasAncestor(listKey);

    if (state) {
      query.filter('state', '=', state);
    }

    const [entities] = await this.datastore.runQuery(query);
    const wishes = entities.map((e) => this.mapToDto(e));

    // Récupérer la liste SANS appliquer les règles pour avoir les données complètes
    const wishList = await this.wishListService.getUnfiltered(listName);

    // Appliquer les règles de filtrage sur les wishes
    return this.wishRulesService.applyRulesToWishes(user, wishList, wishes);
  }

  async getWish(user: any, listName: string, wishId: number): Promise<WishDto> {
    const key = this.datastore.key([
      'WishList',
      listName,
      'Wish',
      this.datastore.int(wishId),
    ]);
    const [entity] = await this.datastore.get(key);
    if (!entity) throw new NotFoundException();
    const wish = this.mapToDto(entity);

    // Récupérer la liste SANS filtrage pour avoir les données complètes
    const wishList = await this.wishListService.getUnfiltered(listName);

    // Appliquer les règles de filtrage
    return this.wishRulesService.applyRulesToWish(user, wishList, wish);
  }

  async createOrUpdate(
    user: any,
    listName: string,
    dto: WishDto,
  ): Promise<WishDto> {
    const listKey = this.datastore.key(['WishList', listName]);

    // Récupérer la liste pour vérifier les permissions
    const wishList = await this.wishListService.getOrThrow(listName);

    // Vérifier si l'utilisateur peut ajouter/modifier
    if (dto.id) {
      // Modification
      const existingKey = this.datastore.key([
        'WishList',
        listName,
        'Wish',
        this.datastore.int(dto.id),
      ]);
      const [existing] = await this.datastore.get(existingKey);
      if (existing) {
        const existingWish = this.mapToDto(existing);
        if (
          !this.wishRulesService.canUpdateWish(
            wishList,
            existingWish,
            user.email,
          )
        ) {
          throw new ForbiddenException('Cannot update this wish');
        }
      }
    } else {
      // Création
      if (
        !this.wishRulesService.canAddWish(wishList, user.email, dto.suggest)
      ) {
        throw new ForbiddenException('Cannot add wish to this list');
      }
    }

    let key;
    if (dto.id) {
      key = this.datastore.key([
        'WishList',
        listName,
        'Wish',
        this.datastore.int(dto.id),
      ]);
    } else {
      key = this.datastore.key(['WishList', listName, 'Wish']);
    }

    // Encoder les participants si présents
    let encodedUserTake = dto.userTake || [];
    if (encodedUserTake.length > 0) {
      encodedUserTake = encodedUserTake.map((p) =>
        this.wishRulesService.encodeParticipant(p),
      );
    }

    const entity = {
      key: key,
      data: {
        label: dto.label,
        description: dto.description,
        state: dto.state || WishState.ACTIVE,
        date: new Date(),
        owner: { email: user.email, name: user.name },
        list: listKey,
        rating: dto.rating || 0,
        pictures: dto.pictures || [],
        urls: dto.urls || [],
        suggest: dto.suggest || false,
        userTake: encodedUserTake,
        comments: dto.comments || [],
      },
    };

    await this.datastore.save(entity);
    const [saved] = await this.datastore.get(key);
    const savedWish = this.mapToDto(saved);

    // Appliquer les règles avant de retourner
    return this.wishRulesService.applyRulesToWish(user, wishList, savedWish);
  }

  async give(user: any, listName: string, wishId: number): Promise<WishDto> {
    const key = this.datastore.key([
      'WishList',
      listName,
      'Wish',
      this.datastore.int(wishId),
    ]);
    const [wish] = await this.datastore.get(key);
    if (!wish) throw new NotFoundException();

    // Vérifier les permissions
    const wishList = await this.wishListService.getOrThrow(listName);
    if (!this.wishRulesService.canGive(wishList, user.email)) {
      throw new ForbiddenException('Cannot participate in this list');
    }

    if (!wish.userTake) wish.userTake = [];

    // Encoder le participant avant de l'ajouter
    const participant = this.wishRulesService.encodeParticipant({
      email: user.email,
      name: user.name,
    });

    wish.userTake.push(participant);

    await this.datastore.save({ key, data: wish });
    const updatedWish = this.mapToDto(wish);

    // Appliquer les règles avant de retourner
    return this.wishRulesService.applyRulesToWish(user, wishList, updatedWish);
  }

  async cancel(user: any, listName: string, wishId: number): Promise<WishDto> {
    const key = this.datastore.key([
      'WishList',
      listName,
      'Wish',
      this.datastore.int(wishId),
    ]);
    const [wish] = await this.datastore.get(key);
    if (!wish) throw new NotFoundException();

    // L'email est encodé dans la base, il faut encoder l'email de l'utilisateur pour la comparaison
    const encodedEmail = this.wishRulesService.encodeParticipant({
      email: user.email,
    }).email;

    if (wish.userTake) {
      wish.userTake = wish.userTake.filter(
        (u: any) => u.email !== encodedEmail,
      );
    }
    await this.datastore.save({ key, data: wish });
    const updatedWish = this.mapToDto(wish);

    // Récupérer la liste et appliquer les règles
    const wishList = await this.wishListService.getOrThrow(listName);
    return this.wishRulesService.applyRulesToWish(user, wishList, updatedWish);
  }

  async addComment(
    user: any,
    listName: string,
    wishId: number,
    comment: CommentDto,
  ): Promise<WishDto> {
    const key = this.datastore.key([
      'WishList',
      listName,
      'Wish',
      this.datastore.int(wishId),
    ]);
    const [wish] = await this.datastore.get(key);
    if (!wish) throw new NotFoundException();

    if (!wish.comments) wish.comments = [];
    wish.comments.push({
      ...comment,
      author: { email: user.email, name: user.name },
      date: new Date(),
    });

    await this.datastore.save({ key, data: wish });
    return this.mapToDto(wish);
  }

  async deleteWish(user: any, listName: string, wishId: number) {
    const key = this.datastore.key([
      'WishList',
      listName,
      'Wish',
      this.datastore.int(wishId),
    ]);
    await this.datastore.delete(key);
  }

  async archived(user: any): Promise<WishDto[]> {
    const query = this.datastore
      .createQuery('Wish')
      .filter('userReceived', '=', user.email);
    const [entities] = await this.datastore.runQuery(query);
    const wishes = entities.map((e) => this.mapToDto(e));

    // Appliquer les règles pour les wishes archivés
    return this.wishRulesService.applyRulesToWishes(user, null, wishes);
  }

  async given(user: any): Promise<WishDto[]> {
    // L'email doit être encodé pour la recherche
    const encodedEmail = this.wishRulesService.encodeParticipant({
      email: user.email,
    }).email;

    const query = this.datastore
      .createQuery('Wish')
      .filter('userTake.email', '=', encodedEmail)
      .filter('state', '=', WishState.ACTIVE);
    const [entities] = await this.datastore.runQuery(query);
    const wishes = entities.map((e) => this.mapToDto(e));

    // Appliquer les règles pour les wishes donnés
    return this.wishRulesService.applyRulesToWishes(user, null, wishes);
  }

  private mapToDto(entity: any): WishDto {
    const dto = new WishDto();
    dto.id = entity[this.datastore.KEY]?.id
      ? parseInt(entity[this.datastore.KEY].id)
      : undefined;
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
}
