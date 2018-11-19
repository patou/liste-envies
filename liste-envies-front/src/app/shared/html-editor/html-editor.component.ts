import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewEncapsulation
} from "@angular/core";
import { MatFormFieldControl } from "@angular/material";
import { FormBuilder, NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";

export enum HtmlEditorType {
  FULL = "full",
  LIGHT = "light"
}

@Component({
  selector: "app-html-editor",
  templateUrl: "./html-editor.component.html",
  styleUrls: ["./html-editor.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MatFormFieldControl, useExisting: HtmlEditorComponent },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatFormFieldControl),
      multi: true
    }
  ]
})
export class HtmlEditorComponent
  implements OnInit, OnDestroy, MatFormFieldControl<string> {
  static nextId = 0;

  /** MatFormFieldControl **/
  autofilled: boolean;
  stateChanges: Subject<void> = new Subject<void>();
  @HostBinding() id = `html-editor-input-${HtmlEditorComponent.nextId++}`;

  focused = false;
  errorState = false;
  controlType = "example-tel-input";
  describedBy = "";

  get empty() {
    return !this.content;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): string | null {
    return this.content;
  }
  set value(val: string | null) {
    this.content = val;
    this.stateChanges.next();
  }

  @Output() public contentChange = new EventEmitter<string>();
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string = "Entrez un texte";
  private _placeholderCurrent: string = "";

  /** custom params **/
  @Input() public content: string | null = "";

  @Input() public type: HtmlEditorType = HtmlEditorType.FULL;

  public theme: string;
  public height: string;

  public modulesToolbar;

  ngOnInit() {
    switch (this.type) {
      case HtmlEditorType.LIGHT:
        this.theme = "bubble";
        this.height = "90px";
        this.modulesToolbar = {
          toolbar: [
            [
              "bold",
              "italic",
              "blockquote",
              { list: "ordered" },
              { list: "bullet" },
              "clean"
            ]
          ]
        };
        break;

      case HtmlEditorType.FULL:
      default:
        this.theme = "snow";
        this.height = "250px";
        this.modulesToolbar = {
          toolbar: [
            [
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              { list: "ordered" },
              { list: "bullet" },
              { color: [] },
              "clean"
            ]
          ]
        };
        break;
    }
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>
  ) {
    fm.monitor(elRef, true).subscribe(origin => {
      this.focused = !!origin;
      if (origin == null) {
        this._placeholderCurrent = "";
      } else {
        this._placeholderCurrent = this._placeholder;
      }
      this.stateChanges.next();
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(" ");
  }

  onContainerClick(event: MouseEvent) {
    this._placeholderCurrent = this._placeholder;
  }
}
