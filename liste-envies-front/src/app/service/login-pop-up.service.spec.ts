import { TestBed } from "@angular/core/testing";

import { LoginPopUpService } from "./login-pop-up.service";
import { MatDialog } from "@angular/material/dialog";

describe("LoginPopUpService", () => {
  let service: LoginPopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatDialog]
    });
    service = TestBed.inject(LoginPopUpService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
