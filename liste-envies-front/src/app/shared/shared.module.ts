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

import { AuthService } from "../service/auth.service";

import { LatinizePipe } from "./pipes/latinize.pipe";
import { StripTagsPipe } from "./pipes/strip-tags.pipe";
import { TruncatePipe } from "./pipes/truncate.pipe";
import { AvatarComponent } from "./avatar/avatar.component";
import { WishListItemComponent } from "./wish-list-item/wish-list-item.component";
import { RouterModule } from "@angular/router";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { ImgFormComponent } from "./img-form/img-form.component";
import { ReadMoreComponent } from "./read-more/read-more.component";
import { PageFooterComponent } from "./page-footer/page-footer.component";
import { WishFiltersFormComponent } from "../component/wish-filters-form/wish-filters-form.component";
import { UserShareComponent } from "./user-share/user-share.component";
import { FilePondModule, registerPlugin } from "ngx-filepond";

/*import { Ng2GridDirective } from './ng2-grid/ng2-grid.directive';*/

import * as FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import * as FilePondPluginFileEncode from "filepond-plugin-file-encode";
import * as FilePondPluginImageResize from "filepond-plugin-image-resize";
import * as FilePondPluginImageTransform from "filepond-plugin-image-transform";
import * as FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
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
    BrowserAnimationsModule,
    MaterialModule,
    QuillModule.forRoot(),
    FilePondModule,
    RouterModule,
    MomentModule,
    LatinizePipe,
    StripTagsPipe,
    TruncatePipe,
    AvatarComponent
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
    BrowserAnimationsModule,
    MaterialModule,
    QuillModule,
    RatingComponent,
    FlipCardComponent,
    HtmlEditorComponent,
    LinksFormComponent,
    ImgFormComponent,
    FilePondModule,
    LatinizePipe,
    StripTagsPipe,
    TruncatePipe,
    AvatarComponent,
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
  providers: [AuthService, LatinizePipe]
})
export class SharedModule {}
