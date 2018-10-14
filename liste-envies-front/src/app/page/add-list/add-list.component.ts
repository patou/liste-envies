import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {WishList} from "../../models/WishList";
import {LatinizePipe} from "ng-pipes";
import {Subject} from 'rxjs/Subject';
import {WishItem} from '../../models/WishItem';
import {DemoWishListService} from '../../service/demo/demo-wish-list.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss']
})
export class AddListComponent implements OnInit {

  isLinear = false;
  nameFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  wishList: WishList;
  demoList: WishList;

  previewAs: 'OWNER' | 'REGISTRER' | 'PUBLIC' = 'OWNER';

  demoWhishs: Subject<WishItem[]> = new Subject<WishItem[]>();

  constructor(private _formBuilder: FormBuilder, private latinize: LatinizePipe, private demoWishService: DemoWishListService) {
    this.wishList = {title : 'titre', picture: '', description: 'description ', privacy: 'PRIVATE'};
  }

  ngOnInit() {
    /*this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });*/
    this.onChangesPrivacy(null);
    this.changesdemoWish();
  }

  changeName(name) {
    this.onChanges(name);
    if (name) {
      this.wishList.name = this.latinize.transform(name.toLowerCase().replace(' ', '_'));
    }
  }

  public onChanges($event) {
    console.debug('OnChanges :', $event);
    this.demoList = {...this.wishList};
  }

  public onChangesPrivacy($event) {
    console.debug('OnChanges Privacy', $event);
    this.changesdemoWish();
    this.onChanges($event);

  }

  private changesdemoWish() {
    this.demoWhishs.next(this.demoWishService.getWishForPrivacy(this.wishList.privacy, this.previewAs, true));
  }

  public onChangePreview($event) {
    console.debug('OnChanges Preview ', $event);
    this.previewAs = $event.value;
    this.changesdemoWish();

  }
}
