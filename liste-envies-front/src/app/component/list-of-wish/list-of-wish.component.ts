import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {WishItem} from '../../models/WishItem';
import {Observable} from 'rxjs/Observable';

declare var Macy;
import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {setTimeout} from 'timers';

@Component({
  selector: 'app-list-of-wish',
  templateUrl: './list-of-wish.component.html',
  styleUrls: ['./list-of-wish.component.scss']
})
export class ListOfWishComponent implements OnInit, AfterViewInit, OnChanges {



  @Input() public list: Observable<WishItem[]>;

  public bricks;

  public sizes = [
    { columns: 2, gutter: 10 },                   // assumed to be mobile, because of the missing mq property
    { mq: '768px', columns: 3, gutter: 50 },
    { mq: '1024px', columns: 4, gutter: 80 }
  ];

  @ViewChild('bricksList') bricksList: ElementRef;

  constructor() { }

  ngOnInit() {

    console.log('On init wishItems ', this.list);

    /*this.list.subscribe({
      next: (wishItems: WishItem[]) => {
        this.bricks
          .resize(true)     // bind resize handler
          .pack();

        console.log('Subscripbe wishItems ', wishItems, this.bricks);
      }
    });*/
  }

    ngAfterViewInit(): void {


// create an instance





    }

  ngOnChanges(changes: SimpleChanges): void {

    console.log('On changes', changes, this.bricks);

    if (!changes.firstChange)  {


      setTimeout(() => {


        this.bricks =  Macy({
          container: '#bricks-list',
          trueOrder: false,
          waitForImages: false,
          margin: 24,
          columns: 4,
          breakAt: {
            1200: 3,
            940: 2,
            520: 2,
            400: 1
          }
        });



        console.log('Timeout wishItems ', this.bricksList, this.bricks);
      }, 2000);
    }

  }


}
