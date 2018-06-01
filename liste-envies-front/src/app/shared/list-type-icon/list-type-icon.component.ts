import { Input, Component } from "@angular/core";

@Component({
  selector: 'list-type-icon',
  template: `<mat-icon fontSet="fa" [fontIcon]="icon"></mat-icon>`,
  styles: [`
  :host {
    margin: 5px;
  }
  `]
})
export class ListTypeIcon {
  icon: string;

  @Input("type")
  set type(type: string) {
    this.icon = this.getIconClassName(type);
  }

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
