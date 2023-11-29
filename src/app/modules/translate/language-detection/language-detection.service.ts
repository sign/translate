import {Injectable} from '@angular/core';
import {TranslationService} from '../translate.service';

const OBSOLETE_LANGUAGE_CODES = {
  iw: 'he',
};
const DEFAULT_SPOKEN_LANGUAGE = 'en';

@Injectable({
  providedIn: 'root',
})
export abstract class LanguageDetectionService {
  constructor(private translationService: TranslationService) {}

  abstract init(): Promise<void>;

  abstract detectSpokenLanguage(text: string): Promise<string>;

  protected languageCode(language: string): string {
    const correctedCode = OBSOLETE_LANGUAGE_CODES[language] ?? language;
    return this.translationService.spokenLanguages.includes(correctedCode) ? correctedCode : DEFAULT_SPOKEN_LANGUAGE;
  }
}
