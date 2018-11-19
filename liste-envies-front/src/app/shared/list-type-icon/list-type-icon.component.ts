import { Input, Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "list-type-icon",
  template: `
    <ng-container [ngSwitch]="type">
      <span *ngSwitchCase="'CHRISTMAS'"
        ><mat-icon fontSet="fa" fontIcon="fa-tree"></mat-icon
      ></span>
      <span *ngSwitchCase="'BIRTHDAY'"
        ><mat-icon fontSet="fa" fontIcon="fa-birthday-cake"></mat-icon
      ></span>
      <span *ngSwitchCase="'WEDDING'"
        ><mat-icon fontSet="fa" fontIcon="fa-heart"></mat-icon
      ></span>
      <span *ngSwitchCase="'LEAVING'"
        ><mat-icon fontSet="fa" fontIcon="fa-plane"></mat-icon
      ></span>
      <span *ngSwitchCase="'SPECIAL_OCCASION'"
        ><mat-icon fontSet="fa" fontIcon="fa-magic"></mat-icon
      ></span>
      <span *ngSwitchCase="'BIRTH'"
        ><mat-icon fontSet="fa" fontIcon="fa-child"></mat-icon
      ></span>
      <span *ngSwitchCase="'HOUSE_WARNING'"
        ><mat-icon fontSet="fa" fontIcon="fa-home"></mat-icon
      ></span>
      <span *ngSwitchCase="'RETIREMENT'"
        ><mat-icon fontSet="fa" fontIcon="fa-globe"></mat-icon
      ></span>
      <span *ngSwitchDefault
        ><mat-icon fontSet="fa" fontIcon="fa-gift"></mat-icon
      ></span>
    </ng-container>
  `,
  styles: [
    `
      :host {
        margin: 5px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTypeIcon {
  @Input("type")
  type: string;

  private getIconClassName(type: string) {
    switch (type) {
      case "CHRISTMAS":
        return "fa-tree";

      case "BIRTHDAY":
        return "fa-birthday-cake";

      case "BIRTH":
        return "fa-child";

      case "WEDDING":
        return "fa-circle-thin";

      case "LEAVING":
        return "fa-plane";

      case "SPECIAL_OCCASION":
        return "fa-magic";

      case "HOUSE_WARNING":
        return "fa-home";

      case "RETIREMENT":
        return "fa-globe";

      case "OTHER":
      default:
        return "fa-gift";
    }
  }
}
