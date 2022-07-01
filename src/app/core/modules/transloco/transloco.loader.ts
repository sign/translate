import {HttpClient} from '@angular/common/http';
import {Translation, TRANSLOCO_SCOPE, TranslocoLoader} from '@ngneat/transloco';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(langPath: string): Observable<Translation> {
    const fName = langPath.toLowerCase();
    return this.http.get<Translation>(`assets/i18n/${fName}.json`);
  }
}

export const translocoScopes = {provide: TRANSLOCO_SCOPE, useValue: ['', 'countries', 'languages']};
