import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SharingPrivacyType {
  PRIVATE = 'PRIVATE',
  OPEN = 'OPEN',
  PUBLIC = 'PUBLIC',
}

export enum UserShareType {
  OWNER = 'OWNER',
  SHARED = 'SHARED',
}

export enum WishListStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum WishListType {
  CHRISTMAS = 'CHRISTMAS',
  BIRTHDAY = 'BIRTHDAY',
  BIRTH = 'BIRTH',
  WEDDING = 'WEDDING',
  LEAVING = 'LEAVING',
  SPECIAL_OCCASION = 'SPECIAL_OCCASION',
  HOUSE_WARMING = 'HOUSE_WARMING',
  RETIREMENT = 'RETIREMENT',
  CEREMONY = 'CEREMONY',
  OTHER = 'OTHER',
}

export enum WishState {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum WishListState {
  OWNER = 'OWNER',
  SHARED = 'SHARED',
  LOGGED = 'LOGGED',
  ANONYMOUS = 'ANONYMOUS',
  ARCHIVED = 'ARCHIVED',
}

export enum WishOptionType {
  NONE = 'NONE',
  HIDDEN = 'HIDDEN',
  ANONYMOUS = 'ANONYMOUS',
  ALL = 'ALL',
  ALL_SUGGEST = 'ALL_SUGGEST',
}

export enum CommentType {
  PRIVATE = 'PRIVATE',
  OWNER = 'OWNER',
  PUBLIC = 'PUBLIC',
}

export class UserShareDto {
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserShareType)
  type: UserShareType;
}

export class WishListDto {
  @IsString()
  @IsOptional()
  name?: string; // ID

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isOwner?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserShareDto)
  @IsOptional()
  users?: UserShareDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserShareDto)
  @IsOptional()
  owners?: UserShareDto[];

  @IsEnum(WishListStatus)
  @IsOptional()
  status?: WishListStatus;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsEnum(WishListType)
  @IsOptional()
  type?: WishListType;

  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsEnum(SharingPrivacyType)
  @IsOptional()
  privacy?: SharingPrivacyType;

  @IsBoolean()
  @IsOptional()
  forceAnonymous?: boolean;

  // state field in Java DTO
  @IsOptional()
  state?: WishListState;

  @IsBoolean()
  @IsOptional()
  canSuggest?: boolean;

  @IsOptional()
  counts?: Record<WishState, number>;
}
