import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ListOfWishComponent } from "./list-of-wish.component";

describe("ListOfWishComponent", () => {
  let component: ListOfWishComponent;
  let fixture: ComponentFixture<ListOfWishComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ListOfWishComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfWishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
