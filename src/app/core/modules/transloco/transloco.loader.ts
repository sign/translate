import {HttpClient} from '@angular/common/http';
import {Translation, TRANSLOCO_SCOPE, TranslocoLoader} from '@jsverse/transloco';
import {inject, Injectable} from '@angular/core';

import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(langPath: string): Observable<Translation> {
    const assetPath = `assets/i18n/${langPath}.json`;
    return this.http.get<Translation>(assetPath);
  }
}

export const translocoScopes = {
  provide: TRANSLOCO_SCOPE,
  useValue: ['', 'countries', 'languages', 'signedLanguagesShort'],
};
