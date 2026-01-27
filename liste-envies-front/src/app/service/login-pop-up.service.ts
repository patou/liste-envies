import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoginDialogComponent } from "../component/login-dialog/login-dialog.component";

@Injectable({
  providedIn: "root"
})
export class LoginPopUpService {
  constructor(public dialog: MatDialog) {}

  openLoginPopUp(message: string = null) {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: "80%",
      data: { message }
    });

    return dialogRef.afterClosed();
  }
}
