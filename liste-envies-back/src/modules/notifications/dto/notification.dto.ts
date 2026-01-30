import {
  IsEnum,
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';

export enum NotificationType {
  ADD_WISH = 'ADD_WISH',
  UPDATE_WISH = 'UPDATE_WISH',
  DELETE_WISH = 'DELETE_WISH',
  GIVEN_WISH = 'GIVEN_WISH',
  NEW_LIST = 'NEW_LIST',
  ADD_USER = 'ADD_USER',
  ARCHIVE_WISH = 'ARCHIVE_WISH',
  ADD_NOTE = 'ADD_NOTE',
}

export class NotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  listName: string;

  @IsString()
  listId: string;

  date: Date;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  actionUser: string;

  @IsString()
  actionUserName: string;

  @IsString()
  @IsOptional()
  actionUserPicture?: string;

  @IsNumber()
  @IsOptional()
  wishId?: number;
}

export interface NotificationEntity {
  user: string[];
  type: NotificationType;
  listName: string;
  listId: string;
  actionUser: string;
  actionUserName: string;
  actionUserPicture?: string;
  wishId?: number;
  date: Date;
  message?: string;
}
