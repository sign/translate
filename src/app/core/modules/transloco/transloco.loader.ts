import {HttpClient} from '@angular/common/http';
import {Translation, TRANSLOCO_SCOPE, TranslocoLoader} from '@ngneat/transloco';
import {Injectable} from '@angular/core';
import {catchError, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(langPath: string): Observable<Translation> {
    return this.http.get<Translation>(`assets/i18n/${langPath}.json`).pipe(
      catchError(err => {
        // If the language file is not found, try to load the English version as the fallback
        if (err.status === 404) {
          const lastSlash = langPath.lastIndexOf('/');
          const newLangPath = lastSlash === -1 ? 'en' : langPath.substring(0, lastSlash) + '/en';
          return this.http.get<Translation>(`assets/i18n/${newLangPath}.json`);
        }
        throw err;
      })
    );
  }
}

export const translocoScopes = {
  provide: TRANSLOCO_SCOPE,
  useValue: ['', 'countries', 'languages', 'signedLanguagesShort'],
};
