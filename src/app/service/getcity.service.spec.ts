import { TestBed } from '@angular/core/testing';

import { GetcityService } from './getcity.service';

describe('GetcityService', () => {
  let service: GetcityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetcityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
