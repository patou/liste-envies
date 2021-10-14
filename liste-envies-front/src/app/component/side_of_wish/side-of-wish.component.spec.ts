import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SideOfWishComponent } from "./side-of-wish.component";

describe("ListOfWishComponent", () => {
  let component: SideOfWishComponent;
  let fixture: ComponentFixture<SideOfWishComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SideOfWishComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SideOfWishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
