import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAppUsers(): Promise<import("./dto/user.dto").UserDto[]>;
    getMyAccount(user: any): Promise<import("./dto/user.dto").UserDto | null>;
    addUser(email: string, createUserDto: CreateUserDto, currentUser: any): Promise<import("./dto/user.dto").UserDto>;
    getUser(email: string): Promise<import("./dto/user.dto").UserDto | null>;
    deleteUser(email: string, currentUser: any): Promise<void>;
}
