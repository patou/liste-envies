import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from "@angular/core";
import { debounce } from "lodash-decorators";

@Component({
  selector: "read-more",
  template: `
    <div class="read-more-box" [style.max-height]="currentMaxHeight">
      <p [innerHTML]="content" #readMoreContent></p>
      <p class="read-more" *ngIf="displayed">
        <button
          mat-stroked-button
          color="primary"
          (click)="toggleReadMore()"
          *ngIf="opened; else: readLess"
        >
          {{ textReadLess }}
        </button>
        <ng-template #readLess>
          <button mat-stroked-button color="accent" (click)="toggleReadMore()">
            {{ textReadMore }}
          </button>
        </ng-template>
      </p>
    </div>
  `,
  styles: [
    `
      .read-more-box {
        position: relative;
        overflow: hidden;
        transition: all 2s;
      }

      .read-more-box .read-more {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 30px 0;

        /* "transparent" only works here because == rgba(0,0,0,0) */
        background-image: linear-gradient(to bottom, transparent, white);
      }
    `
  ]
})
export class ReadMoreComponent implements OnInit, AfterViewInit {
  @Input() public maxHeight: number = 120;
  public currentMaxHeight: string;

  @Input() public content: string;
  @Input() public textReadMore = "voir plus ...";
  @Input() public textReadLess = "voir moins ...";

  @ViewChild("readMoreContent") readMoreContent: ElementRef;

  public opened = false;
  public displayed = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.currentMaxHeight = this.maxHeight + "px";
  }

  toggleReadMore() {
    this.opened = !this.opened;
    this.currentMaxHeight = this.opened ? "10000px" : this.maxHeight + "px";
  }

  ngAfterViewInit(): void {
    console.log(
      "ngAfterViewInit :",
      this.el.nativeElement.offsetHeight,
      this.el.nativeElement.clientHeight
    );
    this.testHeight();
  }

  @debounce(300)
  private testHeight() {
    if (this.el.nativeElement.clientHeight < this.maxHeight) {
      this.displayed = false;
    } else {
      this.displayed = true;
    }
  }
}
