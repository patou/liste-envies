import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NotExistsComponent } from "./not-exists.component";

describe("NotExistsComponent", () => {
  let component: NotExistsComponent;
  let fixture: ComponentFixture<NotExistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotExistsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
