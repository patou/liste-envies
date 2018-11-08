import { TestBed, inject } from "@angular/core/testing";

import { DemoWishListService } from "./demo-wish-list.service";

describe("DemoWishListService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemoWishListService]
    });
  });

  it("should be created", inject(
    [DemoWishListService],
    (service: DemoWishListService) => {
      expect(service).toBeTruthy();
    }
  ));
});
