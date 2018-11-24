import { Component, OnInit } from "@angular/core";
import { ID } from "@datorama/akita";
import { Observable } from "rxjs";
import { NotificationsService } from "../../state/app/notifications.service";
import { NotificationsQuery } from "../../state/app/notifications.query";
import {
  Notification,
  Notification_type
} from "../../state/app/notification.model";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"]
})
export class NotificationsComponent implements OnInit {
  Notification_type = Notification_type;

  notifications$: Observable<Notification[]>;
  isLoading$: Observable<boolean>;

  constructor(
    private notificationsQuery: NotificationsQuery,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.notifications$ = this.notificationsQuery.selectAll();
    this.isLoading$ = this.notificationsQuery.selectLoading();

    // this.notificationsService.get();
  }
}
