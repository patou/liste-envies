import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ID } from "@datorama/akita";
import { Observable } from "rxjs";
import { NotificationsService } from "../../state/app/notifications.service";
import { NotificationsQuery } from "../../state/app/notifications.query";
import {
  Notification,
  Notification_type
} from "../../state/app/notification.model";
import { MatNavList, MatListItem, MatDivider } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { MatLine } from "@angular/material/grid-list";
import { MatTooltip } from "@angular/material/tooltip";
import { AsyncPipe, DatePipe } from "@angular/common";
import { StripTagsPipe } from "../../shared/pipes/strip-tags.pipe";
import { TruncatePipe } from "../../shared/pipes/truncate.pipe";
import { MomentModule } from "ngx-moment";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
  imports: [
    MatNavList,
    MatListItem,
    RouterLink,
    MatIcon,
    MatLine,
    MatTooltip,
    MatDivider,
    AsyncPipe,
    DatePipe,
    StripTagsPipe,
    TruncatePipe,
    MomentModule
  ]
})
export class NotificationsComponent implements OnInit {
  Notification_type = Notification_type;

  notifications$: Observable<Notification[]>;
  isLoading$: Observable<boolean>;

  @Output() onSelect = new EventEmitter<void>();

  constructor(
    private notificationsQuery: NotificationsQuery,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.notifications$ = this.notificationsQuery.selectAll();
    this.isLoading$ = this.notificationsQuery.selectLoading();
  }
}
