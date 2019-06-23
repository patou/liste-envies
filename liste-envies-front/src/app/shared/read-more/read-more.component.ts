import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { debounce } from "lodash-decorators";

@Component({
  selector: "read-more",
  template: `
    <div class="read-more-box" [style.max-height]="currentMaxHeight">
      <p [innerHTML]="content" #readMoreContent></p>
      <ng-container *ngIf="hasReadMore">
        <p class="read-more" [hidden]="opened">
          <br />
          <br />
        </p>
      </ng-container>
    </div>
    <div *ngIf="hasReadMore">
      <button
        mat-button
        color="primary"
        (click)="toggleReadMore()"
        [hidden]="!opened"
      >
        {{ textReadLess }}
      </button>
      <button
        mat-button
        color="accent"
        (click)="toggleReadMore()"
        [hidden]="opened"
      >
        {{ textReadMore }}
      </button>
    </div>
  `,
  styles: [
    `
      .read-more-box {
        position: relative;
        overflow: hidden;
        -webkit-transition: all 0.3s ease-out; /* Android 2.1+, Chrome 1-25, iOS 3.2-6.1, Safari 3.2-6  */
        transition: all 0.3s ease-out; /* Chrome 26, Firefox 16+, iOS 7+, IE 10+, Opera, Safari 6.1+  */
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
        transition: all 0.3s ease-out;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadMoreComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() public maxHeight: number = 120;
  public currentMaxHeight: string;

  @Input() public content: string;
  @Input() public textReadMore: string = "voir plus ...";
  @Input() public textReadLess: string = "voir moins ...";

  @ViewChild("readMoreContent", {static: false}) readMoreContent: ElementRef;

  public opened = false;
  public hasReadMore = false;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.currentMaxHeight = this.maxHeight + "px";
  }

  toggleReadMore() {
    this.opened = !this.opened;
    this.currentMaxHeight = this.opened ? "10000px" : this.maxHeight + "px";
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.testHeight();
  }

  @debounce(300)
  private testHeight() {
    if (
      this.el.nativeElement.offsetHeight >= this.maxHeight ||
      this.el.nativeElement.getBoundingClientRect().height >= this.maxHeight
    ) {
      this.hasReadMore = true;
      this.cdr.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.testHeight();
  }
}
