import {TestBed} from '@angular/core/testing';
import {HandsService} from './hands.service';


describe('HandsService', () => {
  let service: HandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
