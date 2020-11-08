import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ListOfWishComponent } from "./list-of-wish.component";

describe("ListOfWishComponent", () => {
  let component: ListOfWishComponent;
  let fixture: ComponentFixture<ListOfWishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListOfWishComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfWishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
