import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PageComponent } from "./page.component";
import { TestingModule } from "../../testing/testing.module";

describe("PageComponent", () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PageComponent],
        imports: [TestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
