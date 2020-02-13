import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from "@angular/core";

import { WishListApiService } from "../../service/wish-list-api.service";
import { Observable } from "rxjs/Observable";
import { WishList } from "../../models/WishList";
import { WishItem } from "../../models/WishItem";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../service/auth.service";
import * as firebase from "firebase";
import { WishEditComponent } from "../../component/wish-edit/wish-edit.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { WishQuery } from "../../state/wishes/wish.query";
import { distinct, distinctUntilKeyChanged, skip, tap } from "rxjs/operators";
import { WishService } from "../../state/wishes/wish.service";
import { DemoService } from "../../state/wishes/demo/demo.service";
import { DemoQuery } from "../../state/wishes/demo/demo.query";
import { untilDestroyed } from "ngx-take-until-destroy";
import { ColorManagementService } from "../../service/color-management.service";
import { WishesListService } from "../../state/wishes/wishes-list.service";

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
    private wishQuery: WishQuery
  ) {}

  ngOnInit() {
    this.userAuth = this.auth.user;

    this.listItems = this.wishQuery.selectAll();
    this.loading$ = this.wishQuery.selectLoading();
  }

  ngOnDestroy(): void {}
}
