import { environment } from "../../environments/environment";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { MaterialModule } from "./shared/material.module";

import { RatingComponent } from "./rating/rating.component";
import { FlipCardComponent } from "./flip-card/flip-card.component";
import { HtmlEditorComponent } from "./html-editor/html-editor.component";
import { QuillModule } from "ngx-quill";
import { LinksFormComponent } from "./links-form/links-form.component";
import { ListTypeIcon } from "./list-type-icon/list-type-icon.component";

import {
  SWIPER_CONFIG,
  SwiperConfigInterface,
  SwiperModule
} from "ngx-swiper-wrapper";
import { AuthService } from "../service/auth.service";


import { AvatarModule } from "ngx-avatar";
import { FlexLayoutModule } from "@angular/flex-layout";
import { LatinizePipe, NgPipesModule } from "ng-pipes";
import { WishListItemComponent } from "./wish-list-item/wish-list-item.component";
import { RouterModule } from "@angular/router";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { ImgFormComponent } from "./img-form/img-form.component";
import { ReadMoreComponent } from "./read-more/read-more.component";
import { PageFooterComponent } from "./page-footer/page-footer.component";
import { WishFiltersFormComponent } from "../component/wish-filters-form/wish-filters-form.component";
import { UserShareComponent } from "./user-share/user-share.component";
import { FilePondModule, registerPlugin } from "ngx-filepond";

/*import { Ng2GridDirective } from './ng2-grid/ng2-grid.directive';*/

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: "horizontal",
  slidesPerView: 1,
  navigation: true,
  pagination: false
};

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { WishListNavItemComponent } from "./wish-list-nav-item/wish-list-nav-item.component";
import { SideOfWishComponent } from "../component/side_of_wish/side-of-wish.component";
import { AppModule } from "../app.module";
import { WishCardComponent } from "../component/wish-card/wish-card.component";
import { MomentModule } from "ngx-moment";
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginFileEncode
);

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    BrowserAnimationsModule,
    MaterialModule,
    QuillModule.forRoot(),
    SwiperModule,
    FilePondModule,
    AvatarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FlexLayoutModule,
    RouterModule,
    MomentModule
  ],
  declarations: [
    RatingComponent,
    FlipCardComponent,
    HtmlEditorComponent,
    LinksFormComponent,
    ImgFormComponent,
    WishListItemComponent,
    WishListNavItemComponent,
    ListTypeIcon,
    ReadMoreComponent,
    PageFooterComponent,
    WishFiltersFormComponent,
    SideOfWishComponent,
    WishCardComponent,
    UserShareComponent
  ],
  exports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    BrowserAnimationsModule,
    MaterialModule,
    QuillModule,
    RatingComponent,
    FlipCardComponent,
    HtmlEditorComponent,
    LinksFormComponent,
    ImgFormComponent,
    AvatarModule,
    FlexLayoutModule,
    SwiperModule,
    FilePondModule,
    ListTypeIcon,
    WishListItemComponent,
    ReadMoreComponent,
    PageFooterComponent,
    WishFiltersFormComponent,
    UserShareComponent,
    SideOfWishComponent,
    WishCardComponent,
    WishListNavItemComponent
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    AuthService,
    LatinizePipe
  ]
})
export class SharedModule {}
