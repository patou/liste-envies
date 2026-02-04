import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { WishItem } from "../../models/WishItem";
import { WishEditComponent } from "../wish-edit/wish-edit.component";
import { MatDialog } from "@angular/material/dialog";
import {
  animate,
  style,
  transition,
  trigger,
  useAnimation
} from "@angular/animations";
import { WishListApiService } from "../../service/wish-list-api.service";
import { bounceInUp } from "ng-animate";
import { WishService } from "../../state/wishes/wish.service";
import { WishQuery } from "../../state/wishes/wish.query";
import { Observable } from "rxjs";
import {
  MatCard,
  MatCardHeader,
  MatCardContent,
  MatCardActions
} from "@angular/material/card";
import { NgClass, AsyncPipe, DatePipe } from "@angular/common";
import { MatProgressBar } from "@angular/material/progress-bar";
import {
  MatIconButton,
  MatMiniFabButton,
  MatButton
} from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { MatMenuTrigger, MatMenu, MatMenuItem } from "@angular/material/menu";
import { AvatarComponent } from "../../shared/avatar/avatar.component";
import { MatDivider, MatList, MatListItem } from "@angular/material/list";
import {
  MatChipOption,
  MatChipListbox,
  MatChipRemove
} from "@angular/material/chips";
import { RatingComponent } from "../../shared/rating/rating.component";
import { ReadMoreComponent } from "../../shared/read-more/read-more.component";
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelContent,
  MatExpansionPanelActionRow
} from "@angular/material/expansion";
import { MatBadge } from "@angular/material/badge";
import { MatLine } from "@angular/material/grid-list";
import {
  MatFormField,
  MatLabel,
  MatSuffix,
  MatHint
} from "@angular/material/input";
import { HtmlEditorComponent } from "../../shared/html-editor/html-editor.component";
import { MomentModule } from "ngx-moment";
import { TruncatePipe } from "../../shared/pipes/truncate.pipe";

@Component({
  selector: "app-wish-card",
  templateUrl: "./wish-card.component.html",
  styleUrls: ["./wish-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("animateWishCard", [
      transition("* => *", useAnimation(bounceInUp)),
      transition(":leave", [
        animate(
          "8s ease-out",
          style({ transform: "translateX(100%) scale(0)", opacity: 0 })
        )
      ])
    ])
  ],
  imports: [
    MatCard,
    NgClass,
    MatProgressBar,
    MatCardHeader,
    MatIconButton,
    MatIcon,
    MatTooltip,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AvatarComponent,
    MatDivider,
    MatChipOption,
    MatCardContent,
    MatChipListbox,
    MatChipRemove,
    RatingComponent,
    ReadMoreComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatBadge,
    MatList,
    MatListItem,
    MatLine,
    MatExpansionPanelContent,
    MatExpansionPanelActionRow,
    MatFormField,
    MatLabel,
    HtmlEditorComponent,
    MatMiniFabButton,
    MatSuffix,
    MatHint,
    MatCardActions,
    MatButton,
    AsyncPipe,
    DatePipe,
    MomentModule,
    TruncatePipe
  ]
})
export class WishCardComponent implements OnInit, OnChanges, OnDestroy {
  animateWishCard: any;

  public wishItem$: Observable<WishItem>;
  @Input() public wishItem: WishItem;

  @Input() readOnly: boolean;
  //@Input() public wishID: number;
  edit = false;

  public index: number = 0;

  public addComment: string = "";

  public toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"], // remove formatting button
    ["link", "image", "video"] // link and image, video
  ];
  public commentExpanded: boolean = false;
  public isActive$: Observable<boolean>;

  constructor(
    public dialog: MatDialog,
    public wishApi: WishListApiService,
    public wishQuery: WishQuery,
    private wishService: WishService
  ) {}

  ngOnInit() {
    this.subscriveWish();
    this.isActive$ = this.wishService.selectIsActive(this.wishItem.id);
  }

  private subscriveWish() {
    /*if (this.wishID) {
      this.wishItem$ = this.wishQuery.selectEntity(this.wishID);
      // this.wishItem = this.wishQuery.getEntity(this.wishID);
    }*/
  }

  editWish(wishItem: WishItem) {
    this.dialog
      .open(WishEditComponent, {
        width: "auto",
        height: "auto",
        maxHeight: "90%",
        maxWidth: "100%",
        panelClass: "matDialogContent",
        data: wishItem
      })
      .afterClosed()
      .subscribe((result: WishItem) => {
        if (result) {
          this.wishService.update(result.id, result);
        } else {
          this.cancelEditWish();
        }
      });
  }

  cancelEditWish() {
    this.edit = false;
  }

  headerClass(wishItem: WishItem) {
    if (/*wishItem.canSuggest && */ wishItem.given) {
      return "header-danger";
    }
    if (/*wishItem.canSuggest && */ wishItem.allreadyGiven) {
      return "header-warning";
    }
    if (wishItem.canSuggest && wishItem.suggest) {
      return "header-info";
    }
    return "header-success";
  }

  give(wishItem: WishItem) {
    this.wishService.give(wishItem.id, wishItem);
  }

  cancelGive(wishItem: WishItem) {
    this.wishService.cancelGive(wishItem.id, wishItem);
  }

  archive(wishItem: WishItem) {
    this.wishService.archive(wishItem.id, wishItem);
  }

  remove(wishItem: WishItem) {
    this.wishService.remove(wishItem.id, wishItem);
  }

  sendComment(value: string, wishItem: WishItem) {
    this.addComment = "";
    this.wishService.comment(
      wishItem.listId,
      wishItem.id,
      {
        text: value
      },
      wishItem
    );
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {}
}
