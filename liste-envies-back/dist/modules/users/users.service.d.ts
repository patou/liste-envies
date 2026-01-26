import { BaseRepository } from '../../common/repository/base.repository';
import { UserDto, CreateUserDto } from './dto/user.dto';
export interface AppUserEntity {
    email: string;
    name: string;
    picture: string;
    birthday: string;
    isAdmin: boolean;
}
export declare class UsersService extends BaseRepository<AppUserEntity> {
    constructor();
    getAll(): Promise<UserDto[]>;
    findByEmail(email: string): Promise<UserDto | null>;
    createOrUpdate(email: string, dto: CreateUserDto): Promise<UserDto>;
    private mapToDto;
}
