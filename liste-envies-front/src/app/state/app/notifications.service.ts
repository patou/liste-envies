import { Injectable } from "@angular/core";
import { ID } from "@datorama/akita";
import { HttpClient } from "@angular/common/http";
import { NotificationsStore } from "./notifications.store";
import { Notification } from "./notification.model";
import { WishListApiService } from "../../service/wish-list-api.service";
import { NotificationsQuery } from "./notifications.query";

@Injectable({ providedIn: "root" })
export class NotificationsService {
  constructor(
    private notificationsStore: NotificationsStore,
    private notificationsQuery: NotificationsQuery
  ) {}

  add(notification: Notification[]) {
    if (this.notificationsQuery.getHasCache()) {
      this.notificationsStore.setLoading(false);
    }

    this.notificationsStore.add(notification, { prepend: true });
  }

  update(id, notification: Partial<Notification>) {
    this.notificationsStore.update(id, notification);
  }

  remove(id: ID) {
    this.notificationsStore.remove(id);
  }

  reset() {
    this.notificationsStore.setLoading(true);
    this.notificationsStore.reset();
  }
}
