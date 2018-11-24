//ADD_WISH, UPDATE_WISH, DELETE_WISH, GIVEN_WISH, NEW_LIST, ADD_USER, ARCHIVE_WISH, ADD_NOTE
export enum Notification_type {
  ADD_WISH = "ADD_WISH",
  UPDATE_WISH = "UPDATE_WISH",
  DELETE_WISH = "DELETE_WISH",
  GIVEN_WISH = "GIVEN_WISH",
  NEW_LIST = "NEW_LIST",
  ADD_USER = "ADD_USER",
  ARCHIVE_WISH = "ARCHIVE_WISH",
  ADD_NOTE = "ADD_NOTE"
}

export interface Notification {
  type: Notification_type;
  listName: string;
  listId: string;
  date: number;
  message: string;
  actionUser: string;
  actionUserName: string;
}

/**
 * A factory function that creates Notifications
 */
export function createNotification(params: Partial<Notification>) {
  return {
    ...params
  } as Notification;
}
