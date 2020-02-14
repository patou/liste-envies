import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";

import { Observable } from "rxjs/Observable";
import { WishItem } from "../../models/WishItem";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../service/auth.service";
import * as firebase from "firebase";
import { MatDialog } from "@angular/material";
import { WishQuery } from "../../state/wishes/wish.query";
import { skip } from "rxjs/operators";
import { WishService } from "../../state/wishes/wish.service";
import { untilDestroyed } from "ngx-take-until-destroy";
import { ColorManagementService } from "../../service/color-management.service";

@Component({
  selector: "app-archive",
  templateUrl: "./received.component.html",
  styleUrls: ["./received.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceivedComponent implements OnInit, OnDestroy {
  listItems: Observable<WishItem[]>;

  loading$: Observable<boolean>;

  @Input()
  items: Observable<WishItem[]>;

  public userAuth: Observable<firebase.User>;

  constructor(
    private wishService: WishService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog,
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

  ngOnDestroy(): void {}

  private loadList() {
    console.log("loadlist");
    this.wishService.getReceived(false);
  }
}
