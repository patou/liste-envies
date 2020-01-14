import { Input, Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "list-type-icon",
  template: `
    <ng-container [ngSwitch]="type">
      <span [class]="size" *ngSwitchCase="'CHRISTMAS'"
        ><mat-icon>
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="tree"
            class="svg-inline--fa fa-tree fa-w-12"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path
              fill="currentColor"
              d="M378.31 378.49L298.42 288h30.63c9.01 0 16.98-5 20.78-13.06 3.8-8.04 2.55-17.26-3.28-24.05L268.42 160h28.89c9.1 0 17.3-5.35 20.86-13.61 3.52-8.13 1.86-17.59-4.24-24.08L203.66 4.83c-6.03-6.45-17.28-6.45-23.32 0L70.06 122.31c-6.1 6.49-7.75 15.95-4.24 24.08C69.38 154.65 77.59 160 86.69 160h28.89l-78.14 90.91c-5.81 6.78-7.06 15.99-3.27 24.04C37.97 283 45.93 288 54.95 288h30.63L5.69 378.49c-6 6.79-7.36 16.09-3.56 24.26 3.75 8.05 12 13.25 21.01 13.25H160v24.45l-30.29 48.4c-5.32 10.64 2.42 23.16 14.31 23.16h95.96c11.89 0 19.63-12.52 14.31-23.16L224 440.45V416h136.86c9.01 0 17.26-5.2 21.01-13.25 3.8-8.17 2.44-17.47-3.56-24.26z"
            ></path>
          </svg> </mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'BIRTHDAY'">
        <mat-icon
          ><svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="birthday-cake"
            class="svg-inline--fa fa-birthday-cake fa-w-14"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M448 384c-28.02 0-31.26-32-74.5-32-43.43 0-46.825 32-74.75 32-27.695 0-31.454-32-74.75-32-42.842 0-47.218 32-74.5 32-28.148 0-31.202-32-74.75-32-43.547 0-46.653 32-74.75 32v-80c0-26.5 21.5-48 48-48h16V112h64v144h64V112h64v144h64V112h64v144h16c26.5 0 48 21.5 48 48v80zm0 128H0v-96c43.356 0 46.767-32 74.75-32 27.951 0 31.253 32 74.75 32 42.843 0 47.217-32 74.5-32 28.148 0 31.201 32 74.75 32 43.357 0 46.767-32 74.75-32 27.488 0 31.252 32 74.5 32v96zM96 96c-17.75 0-32-14.25-32-32 0-31 32-23 32-64 12 0 32 29.5 32 56s-14.25 40-32 40zm128 0c-17.75 0-32-14.25-32-32 0-31 32-23 32-64 12 0 32 29.5 32 56s-14.25 40-32 40zm128 0c-17.75 0-32-14.25-32-32 0-31 32-23 32-64 12 0 32 29.5 32 56s-14.25 40-32 40z"
            ></path></svg></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'WEDDING'"
        ><mat-icon>
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="heart"
            class="svg-inline--fa fa-heart fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
            ></path></svg></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'LEAVING'"
        ><mat-icon>
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="plane"
            class="svg-inline--fa fa-plane fa-w-18"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path
              fill="currentColor"
              d="M480 192H365.71L260.61 8.06A16.014 16.014 0 0 0 246.71 0h-65.5c-10.63 0-18.3 10.17-15.38 20.39L214.86 192H112l-43.2-57.6c-3.02-4.03-7.77-6.4-12.8-6.4H16.01C5.6 128-2.04 137.78.49 147.88L32 256 .49 364.12C-2.04 374.22 5.6 384 16.01 384H56c5.04 0 9.78-2.37 12.8-6.4L112 320h102.86l-49.03 171.6c-2.92 10.22 4.75 20.4 15.38 20.4h65.5c5.74 0 11.04-3.08 13.89-8.06L365.71 320H480c35.35 0 96-28.65 96-64s-60.65-64-96-64z"
            ></path></svg></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'SPECIAL_OCCASION'"
        ><mat-icon>
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="magic"
            class="svg-inline--fa fa-magic fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z"
            ></path></svg></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'BIRTH'"
        ><mat-icon>
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="baby"
            class="svg-inline--fa fa-baby fa-w-12"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path
              fill="currentColor"
              d="M192 160c44.2 0 80-35.8 80-80S236.2 0 192 0s-80 35.8-80 80 35.8 80 80 80zm-53.4 248.8l25.6-32-61.5-51.2L56.8 383c-11.4 14.2-11.7 34.4-.8 49l48 64c7.9 10.5 19.9 16 32 16 8.3 0 16.8-2.6 24-8 17.7-13.2 21.2-38.3 8-56l-29.4-39.2zm142.7-83.2l-61.5 51.2 25.6 32L216 448c-13.2 17.7-9.7 42.8 8 56 7.2 5.4 15.6 8 24 8 12.2 0 24.2-5.5 32-16l48-64c10.9-14.6 10.6-34.8-.8-49l-45.9-57.4zM376.7 145c-12.7-18.1-37.6-22.4-55.7-9.8l-40.6 28.5c-52.7 37-124.2 37-176.8 0L63 135.3C44.9 122.6 20 127 7.3 145-5.4 163.1-1 188 17 200.7l40.6 28.5c17 11.9 35.4 20.9 54.4 27.9V288h160v-30.8c19-7 37.4-16 54.4-27.9l40.6-28.5c18.1-12.8 22.4-37.7 9.7-55.8z"
            ></path></svg></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'HOUSE_WARNING'"
        ><mat-icon>
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="home"
            class="svg-inline--fa fa-home fa-w-18"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path
              fill="currentColor"
              d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"
            ></path></svg></mat-icon
      ></span>
      <span [class]="size" *ngSwitchCase="'RETIREMENT'"
        ><mat-icon>
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="home"
            class="svg-inline--fa fa-home fa-w-18"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 62.141 62.141"
          >
            <circle fill="currentColor" cx="25.496" cy="5.667" r="5.667" />
            <path
              fill="currentColor"
              d="M46.002,30.756c-0.042-0.786-0.941-2.689-1.143-3.081c-2.305-4.489-4.717-8.929-7.265-13.287c-3.857-6.601-14.113-0.606-10.239,6.016c0.113,0.193,0.222,0.39,0.335,0.586c-2.353,3.001-5.896,4.117-10.311,3.655c-2.712-0.284-3.355,2.835-1.984,4.549v32.947h1.985V30.254c5.359,0.561,9.869-0.983,13.177-4.194c1.348,2.448,2.662,4.915,3.94,7.396l-8.385,8.023c-1.104,1.056-1.549,2.627-1.168,4.104c1.026,3.974,3.021,11.708,3.563,13.852c1.097,4.346,7.97,3.104,6.869-1.263c-1.028-4.079-2.504-8.777-3.536-12.854c-0.013-0.049-0.029-0.091-0.043-0.138c0.043,0.138,7.621-6.645,7.621-6.645c0.352,6.797,0.697,14.014,1.045,20.304c0.253,4.495,7.226,4.145,6.974-0.362C46.959,49.816,46.481,39.412,46.002,30.756z"
            />
          </svg> </mat-icon
      ></span>
      <span [class]="size" *ngSwitchDefault
        ><mat-icon
          ><svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="gift"
            class="svg-inline--fa fa-gift fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"
            ></path></svg></mat-icon
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
