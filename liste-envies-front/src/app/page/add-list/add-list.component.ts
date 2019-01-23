import { Component, OnDestroy, OnInit } from "@angular/core";
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
import { untilDestroyed } from "ngx-take-until-destroy";
import { AkitaNgFormsManager } from "@datorama/akita-ng-forms-manager";
import { WishesListState } from "../../state/wishes/wishes-list.store";
import { debounceTime, filter, takeUntil } from "rxjs/operators";
import { splice } from "@datorama/akita";

@Component({
  selector: "app-add-list",
  templateUrl: "./add-list.component.html",
  styleUrls: ["./add-list.component.scss"]
})
export class AddListComponent implements OnInit, OnDestroy {
  private sending: boolean;
  private wishListFormGroup: FormGroup;
  get wishListTypePicture(): any[] {
    return !!this.wishList.type
      ? WishListTypePicture.filter(value => value.type === this.wishList.type)
      : WishListTypePicture;
  }
  isLinear = false;
  nameFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  addUsers = new FormControl([]);
  wishList: WishList = {
    title: "",
    name: "",
    picture: "",
    description: "",
    type: null,
    privacy: "PRIVATE",
    users: [],
    owners: [],
    forceAnonymous: false
  };
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
    private router: Router,
    private formsManager: AkitaNgFormsManager<WishesListState>
  ) {}

  ngOnInit() {
    this.wishListFormGroup = this._formBuilder.group({
      title: ["", Validators.required],
      type: [null],
      name: ["", [Validators.required, Validators.pattern("[a-z-_]+")]],
      picture: [""],
      description: [""],
      privacy: ["PRIVATE"],
      users: this._formBuilder.control([]),
      owners: [],
      forceAnonymous: [false]
    });

    this.formsManager.upsert("wishList", this.wishListFormGroup);

    this.wishListFormGroup.setValue(this.wishList);

    this.onChangesPrivacy(null);
    this.demoService.add(
      this.demoService.getWishForPrivacy(
        this.wishList.privacy,
        this.previewAs,
        this.wishList.forceAnonymous
      )
    );

    this.user
      .select()
      .pipe(untilDestroyed(this))
      .subscribe((userInfo: UserState) => {
        if (userInfo.user) {
          const owner = {
            email: userInfo.user.email,
            name: userInfo.user.displayName,
            type: "OWNER"
          };
          // this.wishList.users.push(owner);
          this.wishListFormGroup.controls.users.setValue(this.wishList.users);
        }
      });

    this.wishListFormGroup.controls.users.setValue(this.wishList.users || []);
    this.formsManager
      .selectValue("wishList", "users")
      .pipe(untilDestroyed(this))
      .subscribe((changes: UserShare[]) => {
        const wishlist: Partial<WishList> = {};
        wishlist.owners = changes.filter(user => user.type === "OWNER");

        this.wishListFormGroup.patchValue(wishlist);
      });

    this.formsManager
      .selectValue("wishList", "title")
      .pipe(
        untilDestroyed(this),
        takeUntil(
          this.formsManager
            .selectDirty("wishList", "name")
            .pipe(filter(value => value === true))
        ) // if field name was changed, do not compute name
      )
      .subscribe(value => this.changeName(value));

    this.formsManager
      .selectValue("wishList", "privacy")
      .pipe(untilDestroyed(this))
      .subscribe(value => this.onChangesPrivacy(value));

    this.formsManager
      .selectValue("wishList")
      .pipe(
        untilDestroyed(this),
        debounceTime(500)
      )
      .subscribe(value => this.onChanges(value));
  }

  changeName(name) {
    if (name && this.wishListFormGroup.controls.name.untouched) {
      this.wishListFormGroup.controls.name.setValue(this.formatUrlName(name));
    }
  }

  private formatUrlName(name) {
    return this.latinize.transform(
      name
        .toLowerCase()
        .trim()
        .replace(/ /g, "_")
    );
  }

  public onChanges(wishList) {
    console.log("On change ", wishList);
    this.wishList = wishList;
    this.demoList = { ...this.wishList };
  }

  public onChangesPrivacy($event) {
    this.changesdemoWish();
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
    console.log("Select Img :", picture);
    this.wishListFormGroup.controls.picture.setValue(picture.picture);
  }

  createList() {
    this.sending = true;

    this.wishListService.add(this.wishList).subscribe(newList => {
      this.sending = false;
      this.router.navigate(["/", newList.name]);
    });
  }

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }
}
