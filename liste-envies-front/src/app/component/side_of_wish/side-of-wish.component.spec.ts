import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SideOfWishComponent } from "./side-of-wish.component";

describe("ListOfWishComponent", () => {
  let component: SideOfWishComponent;
  let fixture: ComponentFixture<SideOfWishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideOfWishComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideOfWishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
