import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";

@Component({
  selector: "app-rating",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!readonly) {
    <span class="rating" [ngClass]="{ pointer: !readonly }"
      >@for (rate of [1, 2, 3, 4, 5]; track rate) {
      <button
        mat-icon-button
        (click)="selectStar(rate)"
        [color]="rate === value ? 'accent' : 'primary'"
      >
        <ng-container
          *ngTemplateOutlet="iconTemplate; context: { $implicit: rate }"
        >
        </ng-container>
      </button>
      } @if (!readonly) {
      <mat-icon (click)="selectStar(undefined)" class="light">close</mat-icon>
      }
    </span>
    } @if (readonly) {
    <span>
      <ng-container
        *ngTemplateOutlet="iconTemplate; context: { $implicit: value }"
      >
      </ng-container>
    </span>
    }

    <ng-template #iconTemplate let-rate>
      @switch (rate) {
      <!-- the same view can be shown in more than one case -->
      @case (1) {
      <mat-icon
        class="rating-icon fa-2x"
        fontSet="fa"
        matTooltip="Cela me ferait rire"
        fontIcon="fa-laugh"
      ></mat-icon>
      } @case (2) {
      <mat-icon
        class="rating-icon fa-2x"
        fontSet="fa"
        matTooltip="Cela me serait utile"
        fontIcon="fa-toolbox"
      ></mat-icon>
      } @case (3) {
      <mat-icon
        class="rating-icon fa-2x"
        fontSet="fa"
        matTooltip="Bonne idée"
        fontIcon="fa-lightbulb"
      ></mat-icon>
      } @case (4) {
      <mat-icon
        class="rating-icon fa-2x"
        fontSet="fa"
        matTooltip="J'aime"
        fontIcon="fa-thumbs-up"
      ></mat-icon>
      } @case (5) {
      <mat-icon
        class="rating-icon fa-2x"
        fontSet="fa"
        matTooltip="J'adore"
        fontIcon="fa-heart"
      ></mat-icon>
      } }
    </ng-template>
  `,
  styles: [
    `
      .rating {
        display: flex;
      }
      .light {
        color: #eee;
      }
      .rating-icon:hover {
        color: red;
      }

      .pointer {
        cursor: pointer;
      }
    `
  ],
  providers: [{ provide: MatFormFieldControl, useExisting: RatingComponent }]
})
export class RatingComponent implements MatFormFieldControl<number>, OnInit {
  static nextId = 0;

  @Input()
  value: number;
  @Output() valueChange = new EventEmitter();

  stateChanges = new Subject<void>();

  focused = false;

  ngControl = null;

  errorState = false;

  controlType = "my-tel-input";

  id = "rating";

  get empty() {
    return !this.value;
  }

  get shouldLabelFloat() {
    return true;
  }

  describedBy = "";

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
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(" ");
  }

  onContainerClick(event: MouseEvent) {}

  ngOnInit() {}

  selectStar(rate: number) {
    if (!this._readonly) {
      this.value = rate;
      this.valueChange.emit(rate);
    }
  }
}
