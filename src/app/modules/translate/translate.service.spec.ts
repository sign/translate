import {TestBed} from '@angular/core/testing';
import {TranslationService} from './translate.service';
import {HttpClientModule} from '@angular/common/http';
import {isChrome} from '../../core/constants';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(TranslationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should split spoken language sentences', () => {
    // splitSpokenSentences
    const sentences = ['Hello. ', 'My name is Inigo Montoya. ', 'You killed my father. ', 'Prepare to die. '];
    const text = sentences.join('');
    const language = 'en';
    const result = service.splitSpokenSentences(language, text);
    if (isChrome) {
      expect(result).toEqual(sentences);
    } else {
      expect(result).toEqual([text]);
    }
  });
});
