import {Injectable} from '@angular/core';
import {GoogleAnalyticsService} from '../../core/modules/google-analytics/google-analytics.service';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

interface SignWritingTranslationResponse {
  text: string;
  // TODO: add other fields like text probability, etc.
}

@Injectable({
  providedIn: 'root',
})
export class SignWritingTranslationService {
  constructor(private ga: GoogleAnalyticsService, private http: HttpClient) {}

  translateOffline(
    text: string,
    model: 'spoken-to-signed' | 'signed-to-spoken'
  ): Observable<SignWritingTranslationResponse> {
    // TODO: 1. load relevant model if not loaded yet
    // TODO: 2. translate
    // TODO: 3. create a generic model for each direction, as well as language-pair (en-us, not en-fr) specific models.
    //  only language-speicifc models which are better than the generic model should be stored in the manifest of models.
    //  however, if the user is offline, and has the generic model, use that instead.
    return of({text: 'a b c'});
  }

  translateOnline(
    text: string,
    model: 'spoken-to-signed' | 'signed-to-spoken'
  ): Observable<SignWritingTranslationResponse> {
    const url = `https://spoken-to-signed-sxie2r74ua-uc.a.run.app/${model}`; // TODO replace with deployed url
    const query = new URLSearchParams({text});
    return this.http.get<SignWritingTranslationResponse>(`${url}?${query}`);
  }

  translateSpokenToSignWriting(
    text: string,
    spokenLanguage: string,
    signedLanguage: string
  ): Observable<SignWritingTranslationResponse> {
    if (text.trim().length === 0) {
      return of({text: ''});
    }

    const newText = `<SW> <${signedLanguage}> <${spokenLanguage}> ${text}`;
    const isOfflineModel = false;
    if (!isOfflineModel) {
      return this.translateOnline(newText, 'spoken-to-signed');
    }
    return this.translateOffline(newText, 'spoken-to-signed');
  }

  // translateSignWritingToSpoken(text: string, spokenLanguage: string, signedLanguage: string): Observable<SignWritingTranslationResponse> {
  //   const newText = `<SW> <${signedLanguage}> <${spokenLanguage}> ${text}`;
  //   const isOfflineModel = false;
  //   if (!isOfflineModel) {
  //     return this.translateOnline(newText, 'signed-to-spoken');
  //   }
  //   return this.translateOffline(newText, 'signed-to-spoken');
  // }
}
