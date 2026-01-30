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

@Injectable()
export class WishesService extends BaseRepository<any> {
  constructor(private readonly wishListService: WishListService) {
    super('Wish');
  }

  async list(
    email: string,
    listName: string,
    state: WishState = WishState.ACTIVE,
  ): Promise<WishDto[]> {
    const listKey = this.datastore.key(['WishList', listName]);
    const query = this.datastore.createQuery('Wish').hasAncestor(listKey);

    if (state) {
      query.filter('state', '=', state);
    }

    const [entities] = await this.datastore.runQuery(query);
    return entities.map((e) => this.mapToDto(e));
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
    return this.mapToDto(entity);
  }

  async createOrUpdate(
    user: any,
    listName: string,
    dto: WishDto,
  ): Promise<WishDto> {
    const listKey = this.datastore.key(['WishList', listName]);

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
        userTake: dto.userTake || [],
        comments: dto.comments || [],
      },
    };

    await this.datastore.save(entity);
    const [saved] = await this.datastore.get(key);
    return this.mapToDto(saved);
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

    if (!wish.userTake) wish.userTake = [];
    wish.userTake.push({ email: user.email, name: user.name });

    await this.datastore.save({ key, data: wish });
    return this.mapToDto(wish);
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

    if (wish.userTake) {
      wish.userTake = wish.userTake.filter((u: any) => u.email !== user.email);
    }
    await this.datastore.save({ key, data: wish });
    return this.mapToDto(wish);
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

  async archived(userEmail: string): Promise<WishDto[]> {
    const query = this.datastore
      .createQuery('Wish')
      .filter('userReceived', '=', userEmail);
    const [entities] = await this.datastore.runQuery(query);
    return entities.map((e) => this.mapToDto(e));
  }

  async given(userEmail: string): Promise<WishDto[]> {
    const query = this.datastore
      .createQuery('Wish')
      .filter('userTake.email', '=', userEmail)
      .filter('state', '=', WishState.ACTIVE);
    const [entities] = await this.datastore.runQuery(query);
    return entities.map((e) => this.mapToDto(e));
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
