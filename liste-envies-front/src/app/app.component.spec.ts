import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { TestingModule } from "./testing/testing.module";
import { AppModule } from "./app.module";
import { HomeComponent } from "./page/home/home.component";
import { PageComponent } from "./component/page/page.component";
import { ListComponent } from "./page/list/list.component";
describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [AppComponent, HomeComponent, PageComponent, ListComponent]
    }).compileComponents();
  }));
  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
