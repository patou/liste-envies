import { Injectable } from "@angular/core";
import { createInitialState, UserStore } from "./user.store";
import { UserInfo } from "firebase";
import { UserAPIService } from "../../service/user-api.service";
import { UserQuery } from "./user.query";
import { EMPTY, timer, Observable } from "rxjs";
import { concatMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { NotificationsService } from "./notifications.service";
import { Notification } from "./notification.model";
import { resetStores } from "@datorama/akita";
import { MyWishService } from "../wishes/my-wish/my-wish.service";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class UserService {
  private pollingNotifications$: Observable<Notification[]>;
  private pollingNotificationsSubscription$: Subscription;

  constructor(
    private userStore: UserStore,
    private userQuery: UserQuery,
    private api: UserAPIService,
    private notificationService: NotificationsService,
    private myWishService: MyWishService,
    private router: Router
  ) {}

  async login(user: UserInfo, token) {
    const updateUser = this.userStore.update({ user, token });
    await this.pollingNotifications();
    setTimeout(() => this.myWishService.loadAll(), 2000);
    return updateUser;
  }

  logout() {
    resetStores();
    this.userStore.update(createInitialState());
    if (this.pollingNotificationsSubscription$) {
      this.pollingNotificationsSubscription$.unsubscribe();
    }
    this.router.navigate(["/"]);
  }

  private getNotifications() {
    if (!this.isFirstCache()) {
      const snapshot = this.userQuery.getValue();

      if (snapshot && snapshot.user && snapshot.user.email) {
        return this.api.notifications(snapshot.user.email);
      }
    }
    return EMPTY;
  }

  private pollingNotifications() {
    let isFirst = true;
    return new Promise<void>(resolve => {
      this.pollingNotifications$ = timer(800, 30000).pipe(
        concatMap<any, Observable<Notification[]>>(() =>
          this.getNotifications()
        )
      );
      this.pollingNotificationsSubscription$ = this.pollingNotifications$.subscribe(
        (notifications: Notification[]) => {
          if (isFirst) {
            resolve();
          }
          this.notificationService.add(notifications);
        }
      );
    });
  }

  isFirstCache(): boolean {
    return this.userQuery.getHasCache();
  }
}
