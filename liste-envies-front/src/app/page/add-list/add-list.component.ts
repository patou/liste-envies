import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {WishList} from "../../models/WishList";
import {LatinizePipe} from "ng-pipes";

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

  constructor(private _formBuilder: FormBuilder, private latinize: LatinizePipe) {
    this.wishList = {title : 'titre', picture: '', description: 'description '};
  }

  ngOnInit() {
    /*this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });*/
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
}
