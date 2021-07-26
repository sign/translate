import {TestBed} from '@angular/core/testing';
import {TranslationService} from './translate.service';


describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

});
