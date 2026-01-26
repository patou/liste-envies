import { WishesService } from './wishes.service';
import { WishDto, CommentDto } from './dto/wish.dto';
export declare class WishesController {
    private readonly wishesService;
    constructor(wishesService: WishesService);
    getWishes(name: string, user: any): Promise<WishDto[]>;
    getWish(name: string, id: string, user: any): Promise<WishDto>;
    addWish(name: string, dto: WishDto, user: any): Promise<WishDto>;
    updateWish(name: string, id: string, dto: WishDto, user: any): Promise<WishDto>;
    giveWish(name: string, id: string, user: any): Promise<WishDto>;
    cancelGiveWish(name: string, id: string, user: any): Promise<WishDto>;
    addComment(name: string, id: string, comment: CommentDto, user: any): Promise<WishDto>;
    deleteWish(name: string, id: string, user: any): Promise<void>;
}
