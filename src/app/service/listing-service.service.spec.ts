import { TestBed } from '@angular/core/testing';

import { ListingServiceService } from './listing-service.service';

describe('ListingServiceService', () => {
  let service: ListingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
