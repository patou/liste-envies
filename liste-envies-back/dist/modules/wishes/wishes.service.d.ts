import { BaseRepository } from '../../common/repository/base.repository';
import { WishState } from '../wish-list/dto/wish-list.dto';
import { WishDto, CommentDto } from './dto/wish.dto';
import { WishListService } from '../wish-list/wish-list.service';
export declare class WishesService extends BaseRepository<any> {
    private readonly wishListService;
    constructor(wishListService: WishListService);
    list(email: string, listName: string, state?: WishState): Promise<WishDto[]>;
    getWish(user: any, listName: string, wishId: number): Promise<WishDto>;
    createOrUpdate(user: any, listName: string, dto: WishDto): Promise<WishDto>;
    give(user: any, listName: string, wishId: number): Promise<WishDto>;
    cancel(user: any, listName: string, wishId: number): Promise<WishDto>;
    addComment(user: any, listName: string, wishId: number, comment: CommentDto): Promise<WishDto>;
    deleteWish(user: any, listName: string, wishId: number): Promise<void>;
    private mapToDto;
}
