import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ImgFormComponent } from "./img-form.component";

describe("ImgFormComponent", () => {
  let component: ImgFormComponent;
  let fixture: ComponentFixture<ImgFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImgFormComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
