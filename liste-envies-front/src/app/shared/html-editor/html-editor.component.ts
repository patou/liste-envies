import {
  Component,
  ElementRef,
  EventEmitter,
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
import {
  ControlValueAccessor,
  FormBuilder,
  NgControl
} from "@angular/forms";
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
    { provide: MatFormFieldControl, useExisting: HtmlEditorComponent }
  ]
})
export class HtmlEditorComponent
  implements
    OnInit,
    OnDestroy,
    MatFormFieldControl<string>,
    ControlValueAccessor {
  static nextId = 0;

  /** MatFormFieldControl **/
  autofilled: boolean;
  stateChanges: Subject<void> = new Subject<void>();
  @HostBinding() id = `html-editor-input-${HtmlEditorComponent.nextId++}`;
  private _onTouch: () => {};
  private _onChange: (_: string) => {};

  @Input() // hide toolbar when no focuse, default true. False, to display always.
  get hideToolbar(): boolean {
    return this._hideToolbar;
  }

  set hideToolbar(value: boolean) {
    this._hideToolbar = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _hideToolbar = true;

  focused = false;
  errorState = false;
  controlType = "html-editor-input";
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
  @Input()
  get editorHeight(): string {
    return this._height;
  }

  set editorHeight(value: string) {
    this._height = value;
    this.stateChanges.next();
  }
  private _height: string;

  public modulesToolbar;

  ngOnInit() {
    switch (this.type) {
      case HtmlEditorType.LIGHT:
        this.theme = "bubble";
        this._height = !this._height ? "90px" : this._height;
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
        this._height = !this._height ? "250px" : this._height;
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

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
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

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(content: string): void {
    this.content = content;
  }

  onChange($event: string) {
    this._onChange && this._onChange($event);
    this.contentChange.emit($event);
  }
}
