import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";

import { Observable } from "rxjs";
import { WishItem } from "../../models/WishItem";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../service/auth.service";
import type { User } from "firebase/auth";
import { WishQuery } from "../../state/wishes/wish.query";
import { WishService } from "../../state/wishes/wish.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ColorManagementService } from "../../service/color-management.service";

@UntilDestroy()
@Component({
  selector: "app-archive",
  templateUrl: "./received.component.html",
  styleUrls: ["./received.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ReceivedComponent implements OnInit {
  listItems: Observable<WishItem[]>;

  loading$: Observable<boolean>;

  @Input()
  items: Observable<WishItem[]>;

  public userAuth: Observable<User | null>;

  constructor(
    private wishService: WishService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private wishQuery: WishQuery,
    private colorManagementService: ColorManagementService
  ) {}

  ngOnInit() {
    this.colorManagementService.applyDefaultColor();
    this.userAuth = this.auth.user;

    this.listItems = this.wishQuery.selectAll();
    this.loading$ = this.wishQuery.selectLoading();

    this.userAuth.pipe(untilDestroyed(this)).subscribe(value => {
      if (value && value.uid) {
        this.loadList();
      }
    });
  }

  private loadList() {
    this.wishService.getReceived(false);
  }
}
