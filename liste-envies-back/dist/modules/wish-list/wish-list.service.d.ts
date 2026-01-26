import { BaseRepository } from '../../common/repository/base.repository';
import { WishListDto } from './dto/wish-list.dto';
export declare class WishListService extends BaseRepository<any> {
    constructor();
    list(email: string): Promise<WishListDto[]>;
    getAll(): Promise<WishListDto[]>;
    getOrThrow(name: string): Promise<WishListDto>;
    createOrUpdate(user: any, dto: WishListDto): Promise<WishListDto>;
    rename(user: any, name: string, newName: string): Promise<void>;
    deleteList(user: any, name: string): Promise<void>;
    join(user: any, name: string): Promise<WishListDto>;
    private mapToDto;
    private slugify;
}
