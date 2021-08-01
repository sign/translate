import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  translateSpokenToSigned(text: string, spokenLanguage: string, signedLanguage: string): string {
    const api = 'https://nlp.biu.ac.il/~ccohenya8/sign/sentence/';
    const lang = `${spokenLanguage}.${signedLanguage}`;
    return `${api}?slang=${lang}&dlang=${lang}&sentence=${encodeURIComponent(text)}`;
  }

}
