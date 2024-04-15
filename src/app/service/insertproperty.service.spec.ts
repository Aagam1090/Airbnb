import { TestBed } from '@angular/core/testing';

import { InsertpropertyService } from './insertproperty.service';

describe('InsertpropertyService', () => {
  let service: InsertpropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsertpropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
