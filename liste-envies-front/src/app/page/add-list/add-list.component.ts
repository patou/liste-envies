import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { UserShare, WishList } from "../../models/WishList";
import { LatinizePipe } from "ng-pipes";
import { Subject } from "rxjs/Subject";
import { WishItem } from "../../models/WishItem";
import { DemoService } from "../../state/wishes/demo/demo.service";
import { WishesListService } from "../../state/wishes/wishes-list.service";
import { UserQuery } from "../../state/app/user.query";
import { UserState } from "../../state/app/user.store";
import { WishListTypeLabel, WishListTypePicture } from "../../models/const";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-list",
  templateUrl: "./add-list.component.html",
  styleUrls: ["./add-list.component.scss"]
})
export class AddListComponent implements OnInit {
  private sending: boolean;
  get wishListTypePicture(): any[] {
    return !!this.wishList.type
      ? WishListTypePicture.filter(value => value.type === this.wishList.type)
      : WishListTypePicture;
  }
  isLinear = false;
  nameFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  addUsers = new FormControl([]);
  wishList: WishList;
  demoList: WishList;
  wishListLabel = WishListTypeLabel;

  previewAs: "OWNER" | "REGISTRER" | "PUBLIC" = "OWNER";

  demoWhishs: Subject<WishItem[]> = new Subject<WishItem[]>();

  constructor(
    private _formBuilder: FormBuilder,
    private latinize: LatinizePipe,
    private demoService: DemoService,
    private wishListService: WishesListService,
    private user: UserQuery,
    private router: Router
  ) {}

  ngOnInit() {
    /*this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });*/

    this.wishList = {
      title: "",
      picture: "",
      description: "",
      privacy: "PRIVATE",
      users: [],
      owners: []
    };

    this.onChangesPrivacy(null);
    this.demoService.add(
      this.demoService.getWishForPrivacy(
        this.wishList.privacy,
        this.previewAs,
        this.wishList.forceAnonymous
      )
    );

    this.user.select().subscribe((userInfo: UserState) => {
      if (userInfo.user) {
        const owner = {
          email: userInfo.user.email,
          name: userInfo.user.displayName,
          type: "OWNER"
        };
        this.wishList.users.push(owner);
        this.wishList.owners.push(owner);
        this.addUsers.setValue(this.wishList.users);
      }
    });

    this.addUsers.setValue(this.wishList.users);
    this.addUsers.valueChanges.subscribe((changes: UserShare[]) => {
      this.wishList.users = changes;
      this.wishList.owners = changes.filter(user => user.type === "OWNER");

      this.onChanges(this.wishList);
    });
  }

  changeName(name) {
    this.onChanges(name);
    if (name) {
      this.wishList.name = this.latinize.transform(
        name
          .toLowerCase()
          .trim()
          .replace(/ /g, "_")
      );
    }
  }

  public onChanges($event) {
    this.demoList = { ...this.wishList };
  }

  public onChangesPrivacy($event) {
    this.changesdemoWish();
    this.onChanges($event);
  }

  private changesdemoWish() {
    this.demoService.update(
      this.demoService.getWishForPrivacy(
        this.wishList.privacy,
        this.previewAs,
        this.wishList.forceAnonymous
      )
    );
  }

  public onChangePreview($event) {
    this.previewAs = $event.value;
    this.changesdemoWish();
  }

  selectImg(picture: any) {
    this.wishList.picture = picture.picture;
    this.onChanges(this.wishList);
  }

  createList() {
    this.sending = true;

    this.wishListService.add(this.wishList).subscribe(newList => {
      this.sending = false;
      this.router.navigate(["/", newList.name]);
    });
  }
}
