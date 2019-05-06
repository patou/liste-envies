import { Input, Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "list-type-icon",
  template: `
    <ng-container [ngSwitch]="type">
      <span [class]="size" *ngSwitchCase="'CHRISTMAS'"
        ><mat-icon fontSet="fa" fontIcon="fa-tree"></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'BIRTHDAY'"
        ><mat-icon fontSet="fa" fontIcon="fa-birthday-cake"></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'WEDDING'"
        ><mat-icon fontSet="fa" fontIcon="fa-heart"></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'LEAVING'"
        ><mat-icon fontSet="fa" fontIcon="fa-plane"></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'SPECIAL_OCCASION'"
        ><mat-icon fontSet="fa" fontIcon="fa-magic"></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'BIRTH'"
        ><mat-icon fontSet="fa" fontIcon="fa-child"></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'HOUSE_WARNING'"
        ><mat-icon fontSet="fa" fontIcon="fa-home"></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'RETIREMENT'"
        ><mat-icon fontSet="fa" fontIcon="fa-globe"></mat-icon
      ></span>
      <span [class]="size" *ngSwitchDefault
        ><mat-icon fontSet="fa" fontIcon="fa-gift"></mat-icon
      ></span>
    </ng-container>
  `,
  styles: [
    `
      :host {
        margin: 5px;
      }

      span.large svg.svg-inline--fa.fa-child.mat-icon {
        width: 4em;
      }

      span.small svg.svg-inline--fa.fa-child.mat-icon {
        width: 0.75em;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTypeIcon {
  @Input("type")
  type: string;

  @Input() size: "small" | "large" = "small";

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
