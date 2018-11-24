import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { NotificationsStore, NotificationsState } from "./notifications.store";
import { Notification } from "./notification.model";

@Injectable({
  providedIn: "root"
})
@QueryConfig({
  sortBy: "date",
  sortByOrder: Order.DESC
})
export class NotificationsQuery extends QueryEntity<
  NotificationsState,
  Notification
> {
  constructor(protected store: NotificationsStore) {
    super(store);
  }
}
