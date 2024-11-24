import {inject, Injectable} from '@angular/core';
import {LanguageIdentifier} from 'cld3-asm';
import {GoogleAnalyticsService} from '../../../core/modules/google-analytics/google-analytics.service';
import {TranslationService} from '../translate.service';
import {LanguageDetectionService} from './language-detection.service';

@Injectable({
  providedIn: 'root',
})
export class CLD3LanguageDetectionService extends LanguageDetectionService {
  private ga = inject(GoogleAnalyticsService);

  private cld: LanguageIdentifier;

  constructor() {
    const translationService = inject(TranslationService);

    super(translationService);
  }

  async init(): Promise<void> {
    if (this.cld) {
      return;
    }
    const cld3 = await this.ga.trace(
      'language-detector',
      'import',
      () => import(/* webpackChunkName: "cld3-asm" */ 'cld3-asm')
    );
    const cldFactory = await this.ga.trace('language-detector', 'load', () => cld3.loadModule());
    this.cld = await this.ga.trace('language-detector', 'create', () => cldFactory.create(1, 500));
  }

  async detectSpokenLanguage(text: string): Promise<string> {
    if (!this.cld) {
      return this.languageCode(null);
    }

    const language = await this.ga.trace('language-detector', 'find', () => this.cld.findLanguage(text));
    if (language.is_reliable) {
      return this.languageCode(language.language);
    }

    return this.languageCode(null);
  }
}
