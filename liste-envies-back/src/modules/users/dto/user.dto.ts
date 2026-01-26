import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsString()
  @IsOptional()
  birthday?: string;
}

export class UserDto {
  email: string;
  name: string;
  picture: string;
  birthday: string;
  isNewUser: boolean;
  isAdmin: boolean;
}
