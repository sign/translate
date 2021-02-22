import {TestBed} from '@angular/core/testing';

import {PoseService} from './pose.service';

describe('PoseService', () => {
  let service: PoseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
