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
  get wishListTypePicture(): any[] {
    return this._wishListTypePicture.filter(
      value => value.type === this.wishList.type
    );
  }
  isLinear = false;
  nameFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  wishList: WishList;
  demoList: WishList;
  wishListLabel = WishListTypeLabel;

  previewAs: "OWNER" | "REGISTRER" | "PUBLIC" = "OWNER";

  demoWhishs: Subject<WishItem[]> = new Subject<WishItem[]>();
  private _wishListTypePicture: any[] = [
    {
      type: "OTHER",
      picture: "img/default.jpg",
      credit: "Photo by Markus Spiske on Unsplash"
    },
    {
      type: "OTHER",
      picture: "img/default2.jpg",
      credit: "Photo by Markus Spiske on Unsplash"
    },
    {
      type: "OTHER",
      picture: "img/default3.jpg",
      credit: "Photo by Leone Venter on Unsplash"
    },
    {
      type: "OTHER",
      picture: "img/default4.jpg",
      credit: "Photo by Dawid Zawiła on Unsplash"
    },
    {
      type: "OTHER",
      picture: "img/default5.jpg",
      credit: "Photo by Glenn Carstens-Peters on Unsplash"
    },
    {
      type: "OTHER",
      picture: "img/default6.jpg",
      credit: "Photo by Kelly Sikkema on Unsplash"
    },
    {
      type: "CHRISTMAS",
      picture: "img/christmas1.jpg",
      credit: "Photo by Markus Spiske on Unsplash"
    },
    {
      type: "CHRISTMAS",
      picture: "img/christmas2.jpg",
      credit: "Photo by Joanna Kosinska on Unsplash"
    },
    {
      type: "CHRISTMAS",
      picture: "img/christmas3.jpg",
      credit: "Photo by rawpixel.com on Unsplash"
    },
    {
      type: "CHRISTMAS",
      picture: "img/christmas4.jpg",
      credit: "Photo by Andrew Neel on Unsplash"
    },
    {
      type: "CHRISTMAS",
      picture: "img/christmas5.jpg",
      credit: "Photo by Tim Mossholder on Unsplash"
    },
    {
      type: "CHRISTMAS",
      picture: "img/christmas6.jpg",
      credit: "Photo by rawpixel.com on Unsplash"
    },
    {
      type: "CHRISTMAS",
      picture: "img/christmas7.jpg",
      credit: "Photo by Aaron Burden on Unsplash"
    },
    {
      type: "CHRISTMAS",
      picture: "img/christmas8.jpg",
      credit: "Photo by Gareth Harper on Unsplash"
    },
    {
      type: "BIRTH",
      picture: "img/baby.jpg",
      credit: "Photo by insung yoon on Unsplash"
    },
    {
      type: "BIRTH",
      picture: "img/baby1.jpg",
      credit: "Photo by Janko Ferlič on Unsplash"
    },
    {
      type: "BIRTH",
      picture: "img/baby2.jpg",
      credit: "Photo by freestocks.org on Unsplash"
    },
    {
      type: "BIRTH",
      picture: "img/baby3.jpg",
      credit: "Photo by Manuel Schinner on Unsplash"
    },
    {
      type: "BIRTH",
      picture: "img/baby4.jpg",
      credit: "Photo by Janko Ferlič on Unsplash"
    },
    {
      type: "BIRTH",
      picture: "img/baby5.jpg",
      credit: "Photo by Drew Hays on Unsplash"
    },
    {
      type: "BIRTH",
      picture: "img/baby6.jpg",
      credit: "Photo by Megan Menegay on Unsplash"
    },
    {
      type: "BIRTHDAY",
      picture: "img/birthday.jpg",
      credit: "Photo by Nikhita Singhal on Unsplash"
    },
    {
      type: "BIRTHDAY",
      picture: "img/birthday1.jpg",
      credit: "Photo by Annie Spratt on Unsplash"
    },
    {
      type: "BIRTHDAY",
      picture: "img/birthday2.jpg",
      credit: "Photo by Lorene Farrugia on Unsplash"
    },
    {
      type: "BIRTHDAY",
      picture: "img/birthday3.jpg",
      credit: "Photo by Wesual Click on Unsplash"
    },
    {
      type: "BIRTHDAY",
      picture: "img/birthday4.jpg",
      credit: "Photo by Aubrey Fernandez on Unsplash"
    },
    {
      type: "BIRTHDAY",
      picture: "img/birthday5.jpg",
      credit: "Photo by Jon Tyson on Unsplash"
    },
    {
      type: "BIRTHDAY",
      picture: "img/birthday6.jpg",
      credit: "Photo by Rich Helmer on Unsplash"
    },
    {
      type: "SPECIAL_OCCASION",
      picture: "img/fest.jpg",
      credit: "Photo by Gaelle Marcel on Unsplash"
    },
    {
      type: "SPECIAL_OCCASION",
      picture: "img/fest1.jpg",
      credit: "Photo by Pineapple Supply Co. on Unsplash"
    },
    {
      type: "SPECIAL_OCCASION",
      picture: "img/fest2.jpg",
      credit: "Photo by Andreas Weiland on Unsplash"
    },
    {
      type: "SPECIAL_OCCASION",
      picture: "img/travel.jpg",
      credit: "Photo by Andreas Weiland on Unsplash"
    },
    {
      type: "SPECIAL_OCCASION",
      picture: "img/travel1.jpg",
      credit: "Photo by John Matychuk on Unsplash"
    },
    {
      type: "SPECIAL_OCCASION",
      picture: "img/travel2.jpg",
      credit: "Photo by Aaron Burden on Unsplash"
    },
    {
      type: "WEDDING",
      picture: "img/wedding.jpg",
      credit: "Photo by Zoriana Stakhniv on Unsplash"
    },
    {
      type: "WEDDING",
      picture: "img/wedding1.jpg",
      credit: "Photo by Evelina Friman on Unsplash"
    },
    {
      type: "WEDDING",
      picture: "img/wedding2.jpg",
      credit: "Photo by Suhyeon Choi on Unsplash"
    },
    {
      type: "WEDDING",
      picture: "img/wedding3.jpg",
      credit: "Photo by Tamara Menzi on Unsplash"
    },
    {
      type: "WEDDING",
      picture: "img/wedding4.jpg",
      credit: "Photo by Alexandra Gorn on Unsplash"
    },
    {
      type: "WEDDING",
      picture: "img/wedding5.jpg",
      credit: "Photo by Anne Edgar on Unsplash"
    },
    {
      type: "WEDDING",
      picture: "img/wedding6.jpg",
      credit: "Photo by Jamez Picard on Unsplash"
    },
    {
      type: "LEAVING",
      picture: "img/leaving.jpg",
      credit: "Photo by Mantas Hesthaven on Unsplash"
    },
    {
      type: "LEAVING",
      picture: "img/leaving1.jpg",
      credit: "Photo by Yutacar on Unsplash"
    },
    {
      type: "LEAVING",
      picture: "img/leaving2.jpg",
      credit: "Photo by Kristina Evstifeeva on Unsplash"
    }
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private latinize: LatinizePipe,
    private demoService: DemoService
  ) {
    this.wishList = {
      title: "",
      picture: "",
      description: "",
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
