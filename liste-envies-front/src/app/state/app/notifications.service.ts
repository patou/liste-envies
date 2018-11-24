import { Injectable } from "@angular/core";
import { entityExists, ID } from "@datorama/akita";
import { HttpClient } from "@angular/common/http";
import { NotificationsStore } from "./notifications.store";
import { Notification } from "./notification.model";
import { WishListApiService } from "../../service/wish-list-api.service";

@Injectable({ providedIn: "root" })
export class NotificationsService {
  constructor(private notificationsStore: NotificationsStore) {}

  add(notification: Notification[]) {
    if (this.notificationsStore.isPristine) {
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
    this.notificationsStore.setPristine();
  }
}
