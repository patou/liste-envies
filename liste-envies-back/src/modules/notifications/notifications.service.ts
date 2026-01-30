import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repository/base.repository';
import {
  NotificationDto,
  NotificationEntity,
  NotificationType,
} from './dto/notification.dto';
import { UserShareDto, UserShareType } from '../wish-list/dto/wish-list.dto';

interface WishList {
  name: string;
  title: string;
  users: UserShareDto[];
}

interface AppUser {
  email: string;
  name: string;
  picture?: string;
  lastNotification?: Date;
}

@Injectable()
export class NotificationsService extends BaseRepository<NotificationEntity> {
  constructor() {
    super('Notification');
  }

  /**
   * Lists notifications for a specific user
   * @param user User to get notifications for
   * @returns List of notifications ordered by date (most recent first), limited to 35
   */
  async list(user: AppUser): Promise<NotificationDto[]> {
    console.log(
      'NotificationsService.list called with user:',
      JSON.stringify(user),
    );

    if (!user || !user.email) {
      console.error('Invalid user object:', user);
      return [];
    }

    let query = this.datastore
      .createQuery(this.kind)
      .filter('user', '=', user.email);

    // Filter by lastNotification date if it exists and is not null/undefined
    if (user.lastNotification != null) {
      query = query.filter('date', '>=', user.lastNotification);
    }

    query = query.order('date', { descending: true }).limit(35);

    const [entities] = await this.datastore.runQuery(query);
    return entities.map((entity) => this.mapToDto(entity));
  }

  /**
   * Creates a notification for an action on a wishlist
   * @param type Type of notification
   * @param currentUser User performing the action
   * @param wishList WishList affected
   * @param noOwners If true, excludes owners from receiving the notification
   * @param message Optional message
   * @param wishId Optional wish ID
   * @returns Created notification
   */
  async notify(
    type: NotificationType,
    currentUser: AppUser,
    wishList: WishList,
    noOwners: boolean = false,
    message: string = '',
    wishId?: number,
  ): Promise<NotificationDto> {
    const newNotif: NotificationEntity = {
      type,
      listId: wishList.name,
      listName: wishList.title,
      date: new Date(),
      message,
      actionUser: currentUser.email,
      actionUserName: currentUser.name,
      actionUserPicture: currentUser.picture,
      user: wishList.users
        .filter(
          (userShare) =>
            (userShare.type !== UserShareType.OWNER || !noOwners) &&
            userShare.email !== currentUser.email,
        )
        .map((userShare) => userShare.email),
      wishId,
    };

    // Save entity with auto-generated ID
    await this.save(newNotif);
    return this.mapToDto(newNotif);
  }

  /**
   * Creates a notification when users are added to a list
   * @param list WishList where users are added
   * @param users List of user emails being added
   * @param currentUser User performing the action
   * @returns Created notification
   */
  async notifyUserAddedToList(
    list: WishList,
    users: string[],
    currentUser: AppUser,
  ): Promise<NotificationDto> {
    const newNotif: NotificationEntity = {
      type: NotificationType.ADD_USER,
      listId: list.name,
      listName: list.title,
      user: users,
      date: new Date(),
      actionUser: currentUser.email,
      actionUserName: currentUser.name,
      actionUserPicture: currentUser.picture,
    };

    await this.save(newNotif);
    return this.mapToDto(newNotif);
  }

  private mapToDto(entity: any): NotificationDto {
    return {
      type: entity.type,
      listName: entity.listName,
      listId: entity.listId,
      date: entity.date,
      message: entity.message,
      actionUser: entity.actionUser,
      actionUserName: entity.actionUserName,
      actionUserPicture: entity.actionUserPicture,
      wishId: entity.wishId,
    };
  }
}
