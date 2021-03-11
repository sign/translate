import {TestBed} from '@angular/core/testing';

import {DetectorService} from './detector.service';

describe('DetectorService', () => {
  let service: DetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
