import { TestBed } from '@angular/core/testing';

import { ColorManagementService } from './color-management.service';

describe('ColorManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorManagementService = TestBed.get(ColorManagementService);
    expect(service).toBeTruthy();
  });
});
