import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { WishService } from "../../state/wishes/wish.service";
import { AkitaFilter, searchFilter } from "akita-filters-plugin";
import { untilDestroyed } from "ngx-take-until-destroy";
import { WishItem } from "../../models/WishItem";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-wish-filters-form",
  templateUrl: "./wish-filters-form.component.html",
  styleUrls: ["./wish-filters-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class WishFiltersFormComponent implements OnInit, OnDestroy {
  filtersForm = new FormGroup({
    search: new FormControl("", { updateOn: "blur" }),
    type: new FormControl("all"),
    sort: new FormControl("+date"),
    comment: new FormControl("")
    /*categoryControl: new FormControl(),
    size: new FormControl(),
    fastDeliveryControl: new FormControl()*/
  });
  public filters: Observable<AkitaFilter<WishItem>[]>;

  constructor(private wishService: WishService) {}

  ngOnInit() {
    this.filtersForm.controls.search.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((search: string) => {
        if (search) {
          this.wishService.setFilter({
            id: "search",
            value: search,
            order: 20,
            name: `" ${search} "`,
            predicate: entity => searchFilter(search, entity)
          });
        } else {
          this.wishService.removeFilter("search");
        }
      });

    this.filtersForm.controls.type.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(type => {
        if (type === "all") {
          this.removeFilter("type");
          return;
        }

        let typeFilter;
        let typeName: string;
        switch (type) {
          case "to_give":
            typeFilter = (wishes: WishItem) => !wishes.given;
            typeName = "Envies à donner";
            break;

          case "given":
            typeFilter = (wishes: WishItem) => wishes.given;
            typeName = "Envies offertes";
            break;
          case "suggest":
            typeFilter = (wishes: WishItem) => wishes.suggest;
            typeName = "Suggestion";
            break;
        }

        this.wishService.setFilter({
          id: "type",
          value: type,
          name: typeName,
          order: 2,
          predicate: typeFilter
        });
      });

    this.filtersForm.controls.sort.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((sortBy: string) => {
        this.wishService.setOrderBy(sortBy.slice(1), sortBy.slice(0, 1));
      });

    this.filtersForm.controls.comment.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((comment: string) => {
        if (comment) {
          this.wishService.setFilter({
            id: "comment",
            value: "comment",
            name: `" avec commentaires "`,
            predicate: entity => entity.comments && !!entity.comments.length
          });
        } else {
          this.wishService.removeFilter("comment");
        }
      });

    this.filters = this.wishService.selectFilters();

    this.setInitialFilters();
  }

  private setInitialFilters() {
    this.filtersForm.setValue(
      {
        search: this.wishService.getFilterValue("search"),
        comment: this.wishService.getFilterValue("comment"),
        sort: this.wishService.getSort(),
        type: this.wishService.getFilterValue("type")
      },
      { emitEvent: false }
    );
  }

  ngOnDestroy(): void {}

  removeFilter(id: any) {
    this.wishService.removeFilter(id);
  }
}
