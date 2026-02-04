import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { WishList } from "../../models/WishList";
import { NotificationsQuery } from "../../state/app/notifications.query";
import { Observable } from "rxjs";
import { MatListItem } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { ListTypeIcon } from "../list-type-icon/list-type-icon.component";
import { MatLine } from "@angular/material/grid-list";
import { AvatarComponent } from "../avatar/avatar.component";
import { MatTooltip } from "@angular/material/tooltip";
import { MatIcon } from "@angular/material/icon";
import { MatBadge } from "@angular/material/badge";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "wish-list-nav-item",
  templateUrl: "./wish-list-nav-item.component.html",
  styleUrls: ["./wish-list-nav-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListItem,
    RouterLink,
    ListTypeIcon,
    MatLine,
    AvatarComponent,
    MatTooltip,
    MatIcon,
    MatBadge,
    AsyncPipe
  ]
})
export class WishListNavItemComponent implements OnInit {
  @Input()
  wishlist: WishList;

  @Input()
  active: boolean = false;

  notifsCount$: Observable<number>;

  constructor(private notificationQuery: NotificationsQuery) {}

  ngOnInit() {
    this.notifsCount$ = this.notificationQuery.selectCount(
      notification => notification.listId === this.wishlist.name
    );
  }
}
