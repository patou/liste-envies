import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { WishListItemComponent } from "./wish-list-item.component";

describe("WhishListItemComponent", () => {
  let component: WishListItemComponent;
  let fixture: ComponentFixture<WishListItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WishListItemComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WishListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
