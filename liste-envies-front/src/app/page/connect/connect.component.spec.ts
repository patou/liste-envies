import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ConnectComponent } from "./connect.component";

describe("ConnectComponent", () => {
  let component: ConnectComponent;
  let fixture: ComponentFixture<ConnectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConnectComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
