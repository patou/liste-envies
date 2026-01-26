export declare class CreateUserDto {
    email: string;
    name?: string;
    picture?: string;
    birthday?: string;
}
export declare class UserDto {
    email: string;
    name: string;
    picture: string;
    birthday: string;
    isNewUser: boolean;
    isAdmin: boolean;
}
