import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../service/auth.service";
import { Observable } from "rxjs";
import type { User } from "firebase/auth";
import { LoginPopUpService } from "../../service/login-pop-up.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-not-exists",
  templateUrl: "./not-exists.component.html",
  styleUrls: ["./not-exists.component.scss"],
  standalone: false
})
export class NotExistsComponent implements OnInit {
  public userAuth: Observable<User | null>;
  name: string;

  constructor(
    private auth: AuthService,
    private loginPopUp: LoginPopUpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userAuth = this.auth.user;
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
