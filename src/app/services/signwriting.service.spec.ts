import {TestBed} from '@angular/core/testing';

import {SignwritingService} from './signwriting.service';

describe('SignwritingService', () => {
  let service: SignwritingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignwritingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
