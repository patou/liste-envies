import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserShareComponent } from "./user-share.component";

describe("UserShareComponent", () => {
  let component: UserShareComponent;
  let fixture: ComponentFixture<UserShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserShareComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
