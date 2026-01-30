import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WishState } from '../../wish-list/dto/wish-list.dto';

export class LinkDto {
  @IsString()
  url: string;
}

export class PersonDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;
}

export class PersonParticipantDto {
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsString()
  @IsOptional()
  amount?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsBoolean()
  @IsOptional()
  anonymous?: boolean;
}

export class CommentDto {
  @IsString()
  text: string;

  @IsDateString()
  @IsOptional()
  date?: Date;

  @ValidateNested()
  @Type(() => PersonDto)
  author: PersonDto;

  @IsString()
  @IsOptional()
  type?: string; // CommentType from wish-list.dto
}

export class WishDto {
  @IsNumber()
  @IsOptional()
  id?: number; // Datastore Int ID

  @IsString()
  @IsOptional()
  listId?: string;

  @IsString()
  @IsOptional()
  listTitle?: string;

  @ValidateNested()
  @Type(() => PersonDto)
  @IsOptional()
  owner?: PersonDto;

  @IsBoolean()
  @IsOptional()
  suggest?: boolean;

  @IsEnum(WishState)
  @IsOptional()
  state?: WishState;

  @IsString()
  label: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  pictures?: string[];

  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  @IsOptional()
  urls?: LinkDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonParticipantDto)
  @IsOptional()
  userTake?: PersonParticipantDto[];

  @IsBoolean()
  @IsOptional()
  given?: boolean;

  @IsBoolean()
  @IsOptional()
  userGiven?: boolean;

  @IsBoolean()
  @IsOptional()
  allreadyGiven?: boolean;

  @IsBoolean()
  @IsOptional()
  canEdit?: boolean;

  @IsBoolean()
  @IsOptional()
  canParticipate?: boolean;

  @IsBoolean()
  @IsOptional()
  canSuggest?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  @IsOptional()
  comments?: CommentDto[];

  @IsNumber()
  @IsOptional()
  rating?: number;
}
