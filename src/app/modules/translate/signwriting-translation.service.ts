import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

type TranslationDirection = 'spoken-to-signed' | 'signed-to-spoken';

interface TranslationResponse {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class SignWritingTranslationService {
  private http = inject(HttpClient);

  translateOnline(
    direction: TranslationDirection,
    text: string,
    sentences: string[],
    from: string,
    to: string
  ): Observable<TranslationResponse> {
    const url = `https://sw-translation.${environment.apiDomain}/`;
    const body = {
      texts: sentences.map(s => s.trim()),
      spoken_language: from,
      signed_language: to,
    };

    interface SpokenToSignWritingResponse {
      input: string[];
      output: string[];
    }

    return this.http.post<SpokenToSignWritingResponse>(url, body).pipe(map(res => ({text: res.output.join(' ')})));
  }

  translateSpokenToSignWriting(
    text: string,
    sentences: string[],
    spokenLanguage: string,
    signedLanguage: string
  ): Observable<TranslationResponse> {
    return this.translateOnline('spoken-to-signed', text, sentences, spokenLanguage, signedLanguage);
  }

  preProcessSpokenText(text: string) {
    return text.replace('\n', ' ');
  }

  postProcessSignWriting(text: string) {
    text = text.replace(/\$[^\s]+/g, '');

    text = text.replace(/ /g, '');
    text = text.replace(/(\d)M/g, '$1 M');

    return text;
  }
}
