import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { WishListNavItemComponent } from "./wish-list-nav-item.component";

describe("WhishListItemComponent", () => {
  let component: WishListNavItemComponent;
  let fixture: ComponentFixture<WishListNavItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WishListNavItemComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WishListNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
