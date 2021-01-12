import { Component, Inject, OnInit } from "@angular/core";
import { AuthService } from "../../service/auth.service";
import { Observable } from "rxjs";
import * as firebase from "firebase";
import { AuthProvider, Theme } from "ngx-auth-firebaseui";
import { AUTH_PROVIDERS } from "../../shared/auth_providers";
import { LoginPopUpService } from "../../service/login-pop-up.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-not-exists",
  templateUrl: "./not-exists.component.html",
  styleUrls: ["./not-exists.component.scss"]
})
export class NotExistsComponent implements OnInit {
  public userAuth: Observable<firebase.User>;
  theme: Theme = Theme.RAISED;
  name: string;

  constructor(
    private auth: AuthService,
    @Inject(AUTH_PROVIDERS) public providers: AuthProvider[],
    private loginPopUp: LoginPopUpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userAuth = this.auth.user;
    console.log(
      "get Current Navigation : ",
      this.router.getCurrentNavigation(),
      this.route.snapshot
    );
    this.name = this.route.snapshot?.queryParamMap.get("name");
  }

  connect() {
    this.loginPopUp.openLoginPopUp().subscribe(result => {
      if (result) {
        this.goToAddList();
      } else {
        this.goToHome();
      }
    });
  }

  goToAddList() {
    this.router.navigate(["/", "addList"], {
      queryParams: { name: this.name }
    });
  }

  goToHome() {
    this.router.navigate(["/"]);
  }
}
