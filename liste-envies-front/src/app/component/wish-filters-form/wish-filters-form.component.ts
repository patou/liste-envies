import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import { WishService } from "../../state/wishes/wish.service";
import { AkitaFilter, searchFilter } from "akita-filters-plugin";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { WishItem } from "../../models/WishItem";
import { Observable } from "rxjs";
import { WishState } from "../../state/wishes/wish.store";
import {
  MatButtonToggleGroup,
  MatButtonToggle
} from "@angular/material/button-toggle";
import { MatTooltip } from "@angular/material/tooltip";
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatSuffix,
  MatHint
} from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/autocomplete";
import {
  MatChipListbox,
  MatChipOption,
  MatChipRemove
} from "@angular/material/chips";
import { AsyncPipe } from "@angular/common";

@UntilDestroy()
@Component({
  selector: "app-wish-filters-form",
  templateUrl: "./wish-filters-form.component.html",
  styleUrls: ["./wish-filters-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatTooltip,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    MatHint,
    MatSelect,
    MatOption,
    MatChipListbox,
    MatChipOption,
    MatChipRemove,
    AsyncPipe
  ]
})
export class WishFiltersFormComponent implements OnInit {
  filtersForm = new UntypedFormGroup({
    search: new UntypedFormControl("", { updateOn: "blur" }),
    type: new UntypedFormControl("all"),
    sort: new UntypedFormControl("+date"),
    comment: new UntypedFormControl("")
    /*categoryControl: new FormControl(),
    size: new FormControl(),
    fastDeliveryControl: new FormControl()*/
  });
  public filters: Observable<AkitaFilter<WishState>[]>;

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
            typeName = "Envies à offrir";
            break;

          case "given":
            typeFilter = (wishes: WishItem) => wishes.given;
            typeName = "Envies offertes";
            break;
          case "suggest":
            typeFilter = (wishes: WishItem) => wishes.suggest;
            typeName = "Suggestions";
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
            predicate: (entity: any) =>
              entity.comments && !!entity.comments.length
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

  removeFilter(id: any) {
    this.wishService.removeFilter(id);
  }
}
