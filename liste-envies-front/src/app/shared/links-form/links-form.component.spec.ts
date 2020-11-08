import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LinksFormComponent } from "./links-form.component";

describe("ImgFormComponent", () => {
  let component: LinksFormComponent;
  let fixture: ComponentFixture<LinksFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinksFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
