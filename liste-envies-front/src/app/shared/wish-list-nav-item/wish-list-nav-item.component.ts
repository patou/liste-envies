import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { WishList } from "../../models/WishList";
import { NotificationsQuery } from "../../state/app/notifications.query";
import { Observable } from "rxjs";

@Component({
  selector: "wish-list-nav-item",
  templateUrl: "./wish-list-nav-item.component.html",
  styleUrls: ["./wish-list-nav-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
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
