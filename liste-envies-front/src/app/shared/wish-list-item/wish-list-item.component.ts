import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { WishList } from "../../models/WishList";
import { NotificationsQuery } from "../../state/app/notifications.query";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "wish-list-item",
  templateUrl: "./wish-list-item.component.html",
  styleUrls: ["./wish-list-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
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
