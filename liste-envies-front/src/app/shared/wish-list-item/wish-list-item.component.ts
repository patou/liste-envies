import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { WishList } from "../../models/WishList";
import { NotificationsQuery } from "../../state/app/notifications.query";
import { Observable } from "rxjs";
import { MatTooltip } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { ListTypeIcon } from "../list-type-icon/list-type-icon.component";
import { MatIcon } from "@angular/material/icon";
import { MatBadge } from "@angular/material/badge";
import { AvatarComponent } from "../avatar/avatar.component";
import { AsyncPipe } from "@angular/common";
import { StripTagsPipe } from "../pipes/strip-tags.pipe";
import { TruncatePipe } from "../pipes/truncate.pipe";

@Component({
  selector: "wish-list-item",
  templateUrl: "./wish-list-item.component.html",
  styleUrls: ["./wish-list-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTooltip,
    RouterLink,
    ListTypeIcon,
    MatIcon,
    MatBadge,
    AvatarComponent,
    AsyncPipe,
    StripTagsPipe,
    TruncatePipe
  ]
})
export class WishListItemComponent implements OnInit {
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
