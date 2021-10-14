import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { AddUpdateListComponent } from "./add-update-list.component";

describe("AddUpdateListComponent", () => {
  let component: AddUpdateListComponent;
  let fixture: ComponentFixture<AddUpdateListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddUpdateListComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
