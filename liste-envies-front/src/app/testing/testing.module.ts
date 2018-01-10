import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {APP_BASE_HREF} from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {RouterTestingModule} from "@angular/router/testing";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterTestingModule
  ],
  declarations: [],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}],
  exports: [
    CommonModule,
    SharedModule,
    RouterTestingModule
  ]
})
export class TestingModule { }
