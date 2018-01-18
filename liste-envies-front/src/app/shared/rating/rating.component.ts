import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatFormFieldControl } from "@angular/material";
import { Subject } from "rxjs/Subject";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-rating',
  template: `<span class="rating" [ngClass]="{pointer:!readonly}"><mat-icon *ngFor="let rate of [1,2,3,4,5]" (click)="selectStar(rate)">{{rate <= value ? 'favorite' : 'favorite_border'}}</mat-icon><mat-icon *ngIf="!readonly" (click)="selectStar(undefined)" class="light">close</mat-icon></span>`,
  styles: [`
  .rating {
    display: flex;
  }
  .light {
    color: #eee;  
  }
  .pointer {
    cursor: pointer;
  }
  `],
  providers: [{provide: MatFormFieldControl, useExisting: RatingComponent}]
})
export class RatingComponent implements MatFormFieldControl<number>, OnInit {
  @Input()
  value: number;
  @Output() valueChange = new EventEmitter();

  static nextId = 0;

  stateChanges = new Subject<void>();

  focused = false;

  ngControl = null;

  errorState = false;

  controlType = 'my-tel-input';

  id = 'rating';

  get empty() {
    return !this.value;
  }

  get shouldLabelFloat() {
    return true;
  }

  describedBy = '';

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get readonly() {
    return this._readonly;
  }
  set readonly(req) {
    this._readonly = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _readonly = false;

  constructor(private fm: FocusMonitor, private elRef: ElementRef) {
    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {

  }

  ngOnInit() {
  }

  selectStar(rate: number) {
    if (!this._readonly) {
      this.value = rate;
      this.valueChange.emit(rate);
    }
  }

}
