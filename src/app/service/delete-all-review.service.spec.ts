import { TestBed } from '@angular/core/testing';

import { DeleteAllReviewService } from './delete-all-review.service';

describe('DeleteAllReviewService', () => {
  let service: DeleteAllReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteAllReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
