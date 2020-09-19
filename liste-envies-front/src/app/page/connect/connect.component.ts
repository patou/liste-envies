import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../service/auth.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { UserState } from "../../state/app/user.store";
import { UserQuery } from "../../state/app/user.query";
import { Router } from "@angular/router";

@UntilDestroy()
@Component({
  selector: "app-connect",
  templateUrl: "./connect.component.html",
  styleUrls: ["./connect.component.scss"]
})
export class ConnectComponent implements OnInit {
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
}
