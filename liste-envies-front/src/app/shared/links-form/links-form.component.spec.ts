import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { LinksFormComponent } from "./links-form.component";

describe("ImgFormComponent", () => {
  let component: LinksFormComponent;
  let fixture: ComponentFixture<LinksFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LinksFormComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
