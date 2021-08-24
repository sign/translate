import {Injectable} from '@angular/core';
import {LanguageIdentifier, loadModule} from 'cld3-asm';

const OBSOLETE_LANGUAGE_CODES = {
  iw: 'he'
};
const DEFAULT_UNRELIABLE_LANG = 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private cld: LanguageIdentifier;

  async initCld(): Promise<void> {
    if (this.cld) {
      return;
    }
    const cldFactory = await loadModule();
    this.cld = cldFactory.create(1, 500);
  }

  detectSpokenLanguage(text: string): string {
    if (!this.cld) {
      return DEFAULT_UNRELIABLE_LANG;
    }

    const language = this.cld.findLanguage(text);
    const languageCode = language.is_reliable ? language.language : DEFAULT_UNRELIABLE_LANG;
    return OBSOLETE_LANGUAGE_CODES[languageCode] ?? languageCode;
  }

  translateSpokenToSigned(text: string, spokenLanguage: string, signedLanguage: string): string {
    const api = 'https://nlp.biu.ac.il/~ccohenya8/sign/sentence/';
    const lang = `${spokenLanguage}.${signedLanguage}`;
    return `${api}?slang=${lang}&dlang=${lang}&sentence=${encodeURIComponent(text)}`;
  }

}
