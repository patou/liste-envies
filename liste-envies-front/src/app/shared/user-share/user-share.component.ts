import {Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Optional, Self, ViewEncapsulation} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatFormFieldControl, MatTableDataSource} from '@angular/material';
import {ControlValueAccessor, FormBuilder, FormControl, NgControl, Validators} from '@angular/forms';
import {UserShare, WishList} from '../../models/WishList';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Subject} from 'rxjs/Subject';
import {WishesListQuery} from '../../state/wishes/wishes-list.query';
import * as _ from 'lodash';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-user-share',
  templateUrl: './user-share.component.html',
  styleUrls: ['./user-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: MatFormFieldControl, useExisting: UserShareComponent}]
})
export class UserShareComponent
  implements OnInit,
    OnDestroy,
    MatFormFieldControl<UserShare[]>,
    ControlValueAccessor {
  //region Constructor
  static nextId = 0;
  //region MatFormFiels
  readonly autofilled: boolean;

  //endregion
  readonly controlType = 'user-share-input';
  readonly errorState: boolean;
  focused: boolean;
  @HostBinding() id = `html-editor-input-${UserShareComponent.nextId++}`;
  readonly stateChanges: Subject<void> = new Subject<void>();
  describedBy = '';
  addEmailsControl: FormControl = new FormControl('', Validators.email);
  addOwnersControl: FormControl = new FormControl(false);
  displayedColumns: string[] = ['email', 'name', 'type', 'action'];
  users: UserShare[] = [];
  public datasource: MatTableDataSource<UserShare> = new MatTableDataSource(
    this.value
  );

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private wishlistQuery: WishesListQuery
  ) {
    fm.monitor(elRef, true)
      .pipe(untilDestroyed(this))
      .subscribe(origin => {
        this.focused = !!origin;
        this.stateChanges.next();
      });

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  private _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  get empty() {
    return !this._value || !this._value.length;
  }

  private _placeholder: string =
    'Entrez une adresse mail, ou plusieurs séparé par une virgule';

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _required = false;

  @Input()
  get required(): boolean {
    return this._required;
  }
  //endregion

  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  private _value: UserShare[] | null;

  @Input()
  get value(): UserShare[] | null {
    return this._value;
  }

  set value(val: UserShare[] | null) {
    this._value = val;
    this.triggerChangeValue();
  }

  addUsers() {
    const userToAdd = this.addEmailsControl.value;
    if (userToAdd) {
      const emails: string[] = userToAdd.split(',');
      emails.map((email: string) => {
        this.value = [...this.value, this.createUserShare(email.trim())];
      });

      this.afterAddUsers();
    }
  }

  selectedUsers(autocomplete: MatAutocompleteSelectedEvent) {
    const user: any = autocomplete.option.value;
    this.value.push(this.createUserShare(user.email, user.name));
    this.afterAddUsers();
  }

  createUserShare(email: string, name: string = null): UserShare {
    if (!email) {
      return;
    }
    name = name
      ? name
      : email
        .split('@')
        .shift()
        .replace(/[-_.\d]/g, ' ')
        .trim();
    const type = this.addOwnersControl.value ? 'OWNER' : 'SHARED';
    return {email, name, type};
  }

  //region Lifecycle Function
  ngOnInit() {
    if (!this._value) {
      this._value = [];
    }

    this.wishlistQuery
      .selectAll()
      .pipe(untilDestroyed(this))
      .subscribe((wishLists: WishList[]) => {
        const allUsers = wishLists.reduce<UserShare[]>(
          (userList: UserShare[], wishList: WishList) => {
            // todo find a solution for getting other users
            if (wishList.owners) {
              userList.push(...wishList.owners);
            }

            return userList;
          },
          []
        );
        this.users = _.uniqBy(allUsers, 'email');
      });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    // todo focus input
  }

  // Function to call when the rating changes.
  onChange = (users: UserShare[]) => {
  };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {
  };

  //endregion

  //region ValueAccessor

  // Update the model and changes needed for the view here.
  writeValue(users: UserShare[]): void {
    if (!users) {
      return;
    }
    this.value = [...users];
  }

  // Save the function as a property to call later here.
  registerOnChange(fn: (users: UserShare[]) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to update the model (rating).

  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to register a function to call when the model (rating) changes.

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Allows Angular to register a function to call when the input has been touched.

  //endregion
  removeUser(element: UserShare) {
    const elementToRemove = this.value.indexOf(element);
    this.value = [...this.value];
    this.value.splice(elementToRemove, 1);
    this.triggerChangeValue();
  }

  private afterAddUsers() {
    this.addEmailsControl.setValue('');
    this.addOwnersControl.setValue(false);
    this.onTouched();

    this.triggerChangeValue();
  }

  private triggerChangeValue() {
    this.datasource.data = this.value;
    this.onChange(this.value);
    this.stateChanges.next();
  }
}
