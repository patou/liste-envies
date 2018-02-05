import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MaterialModule} from '../../shared/material.module';

import { RatingComponent } from "./rating/rating.component";
import { FlipCardComponent } from "./flip-card/flip-card.component";
import { HtmlEditorComponent } from './html-editor/html-editor.component';
import { QuillModule } from 'ngx-quill';
import { LinksFormComponent } from './links-form/links-form.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    QuillModule
  ],
  declarations: [RatingComponent, FlipCardComponent, HtmlEditorComponent, LinksFormComponent],
  exports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    QuillModule,
    RatingComponent,
    FlipCardComponent,
    HtmlEditorComponent,
    LinksFormComponent
  ]
})
export class SharedModule { }
