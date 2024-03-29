import { Component, Inject, OnInit } from "@angular/core";
import { AuthService } from "../../service/auth.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { UserState } from "../../state/app/user.store";
import { UserQuery } from "../../state/app/user.query";
import { Router } from "@angular/router";
import { AUTH_PROVIDERS } from "../../shared/auth_providers";
import { AuthProvider, Theme } from "ngx-auth-firebaseui";
import { LoginPopUpService } from "../../service/login-pop-up.service";

@UntilDestroy()
@Component({
  selector: "app-connect",
  templateUrl: "./connect.component.html",
  styleUrls: ["./connect.component.scss"]
})
export class ConnectComponent implements OnInit {
  theme: Theme = Theme.RAISED;
  constructor(
    private auth: AuthService,
    private user: UserQuery,
    private router: Router,
    @Inject(AUTH_PROVIDERS) public providers: AuthProvider[],
    private loginPopUp: LoginPopUpService
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
    this.loginPopUp.openLoginPopUp().subscribe(result => {});
  }
}
