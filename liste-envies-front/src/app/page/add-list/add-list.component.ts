import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { WishList } from "../../models/WishList";
import { LatinizePipe } from "ng-pipes";
import { Subject } from "rxjs/Subject";
import { WishItem } from "../../models/WishItem";
import { DemoService } from "../../state/wishes/demo/demo.service";
import { WishListTypeLabel } from "../../models/const";

@Component({
  selector: "app-add-list",
  templateUrl: "./add-list.component.html",
  styleUrls: ["./add-list.component.scss"]
})
export class AddListComponent implements OnInit {
  isLinear = false;
  nameFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  wishList: WishList;
  demoList: WishList;
  wishListLabel = WishListTypeLabel;

  previewAs: "OWNER" | "REGISTRER" | "PUBLIC" = "OWNER";

  demoWhishs: Subject<WishItem[]> = new Subject<WishItem[]>();

  constructor(
    private _formBuilder: FormBuilder,
    private latinize: LatinizePipe,
    private demoService: DemoService
  ) {
    this.wishList = {
      title: "titre",
      picture: "",
      description: "description ",
      privacy: "PRIVATE"
    };
  }

  ngOnInit() {
    /*this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });*/
    this.onChangesPrivacy(null);
    this.demoService.add(
      this.demoService.getWishForPrivacy(
        this.wishList.privacy,
        this.previewAs,
        this.wishList.forceAnonymus
      )
    );
  }

  changeName(name) {
    this.onChanges(name);
    if (name) {
      this.wishList.name = this.latinize.transform(
        name.toLowerCase().replace(" ", "_")
      );
    }
  }

  public onChanges($event) {
    console.debug("OnChanges :", $event);
    this.demoList = { ...this.wishList };
  }

  public onChangesPrivacy($event) {
    console.debug("OnChanges Privacy", $event);
    this.changesdemoWish();
    this.onChanges($event);
  }

  private changesdemoWish() {
    this.demoService.update(
      this.demoService.getWishForPrivacy(
        this.wishList.privacy,
        this.previewAs,
        this.wishList.forceAnonymus
      )
    );
  }

  public onChangePreview($event) {
    console.debug("OnChanges Preview ", $event);
    this.previewAs = $event.value;
    this.changesdemoWish();
  }
}
