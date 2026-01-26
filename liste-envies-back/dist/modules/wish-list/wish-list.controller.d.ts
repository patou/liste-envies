import { WishListService } from './wish-list.service';
import { WishListDto } from './dto/wish-list.dto';
export declare class WishListController {
    private readonly wishListService;
    constructor(wishListService: WishListService);
    getWishListForUser(user: any): Promise<WishListDto[]>;
    getWishListForOtherUser(email: string): Promise<WishListDto[]>;
    getAllList(user: any): Promise<WishListDto[]>;
    updateWishList(name: string, dto: WishListDto, user: any): Promise<WishListDto>;
    addWishList(dto: WishListDto, user: any): Promise<WishListDto>;
    renameWishList(name: string, newName: string, user: any): Promise<void>;
    getOneWishList(name: string): Promise<WishListDto>;
    join(name: string, user: any): Promise<WishListDto>;
    deleteWishList(name: string, user: any): Promise<void>;
}
