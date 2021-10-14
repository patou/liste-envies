import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ListComponent } from "./list.component";
import { TestingModule } from "../testing/testing.module";
import { WishListServiceTest } from "../service/wish-list-service-test";
import { WishListService } from "../service/wish-list-service";

describe("ListComponent", () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ListComponent],
        providers: [
          { provide: WishListService, useClass: WishListServiceTest }
        ],
        imports: [TestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
