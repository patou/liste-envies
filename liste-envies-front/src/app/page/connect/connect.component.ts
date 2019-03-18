import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../service/auth.service";
import { untilDestroyed } from "ngx-take-until-destroy";
import { UserState } from "../../state/app/user.store";
import { UserQuery } from "../../state/app/user.query";
import { Router } from "@angular/router";

@Component({
  selector: "app-connect",
  templateUrl: "./connect.component.html",
  styleUrls: ["./connect.component.scss"]
})
export class ConnectComponent implements OnInit, OnDestroy {
  constructor(
    private auth: AuthService,
    private user: UserQuery,
    private router: Router
  ) {}

  ngOnInit() {
    this.user
      .select()
      .pipe(untilDestroyed(this))
      .subscribe((userInfo: UserState) => {
        if (userInfo.user) {
          this.router.navigateByUrl("/");
        }
      });
  }

  connect() {
    this.auth.openLoginPopUp();
  }

  ngOnDestroy(): void {}
}
