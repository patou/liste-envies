import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { createInitialState, UserStore } from "./user.store";
import { User, UserInfo } from "firebase";
import { UserAPIService } from "../../service/user-api.service";
import { UserQuery } from "./user.query";
import { Observable } from "rxjs/Observable";
import { EMPTY } from "rxjs";
import { timer } from "rxjs/internal/observable/timer";
import { concatMap } from "rxjs/operators";
import { Subscription } from "rxjs/Subscription";
import { NotificationsService } from "./notifications.service";
import { Notification } from "./notification.model";

@Injectable({ providedIn: "root" })
export class UserService {
  private pollingNotifications$: Observable<Notification[]>;
  private pollingNotificationsSubscription$: Subscription;

  constructor(
    private userStore: UserStore,
    private userQuery: UserQuery,
    private api: UserAPIService,
    private notificationService: NotificationsService
  ) {}

  login(user: UserInfo, token) {
    const updateUser = this.userStore.update({ user, token });
    this.pollingNotifications();
    return updateUser;
  }

  logout() {
    this.userStore.update(createInitialState());
    if (this.pollingNotificationsSubscription$) {
      this.pollingNotificationsSubscription$.unsubscribe();
    }
    this.notificationService.reset();
    this.userStore.setPristine();
  }

  private getNotifications() {
    if (!this.isPristine()) {
      const snapshot = this.userQuery.getSnapshot();

      if (snapshot && snapshot.user && snapshot.user.email) {
        return this.api.notifications(snapshot.user.email);
      }
    }
    return EMPTY;
  }

  private pollingNotifications() {
    this.pollingNotifications$ = timer(0, 30000).pipe(
      concatMap<any, Notification[]>(() => this.getNotifications())
    );
    this.pollingNotificationsSubscription$ = this.pollingNotifications$.subscribe(
      (notifications: Notification[]) => {
        this.notificationService.add(notifications);
      }
    );
  }

  isPristine(): boolean {
    return this.userStore.isPristine;
  }
}
