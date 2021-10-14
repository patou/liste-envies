import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ArchiveComponent } from "./list.component";
import { TestingModule } from "../testing/testing.module";
import { WishListServiceTest } from "../service/wish-list-service-test";
import { WishListService } from "../service/wish-list-service";

describe("ListComponent", () => {
  let component: ArchiveComponent;
  let fixture: ComponentFixture<ArchiveComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ArchiveComponent],
        providers: [
          { provide: WishListService, useClass: WishListServiceTest }
        ],
        imports: [TestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
