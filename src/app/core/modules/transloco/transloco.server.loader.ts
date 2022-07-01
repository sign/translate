import {Translation, TranslocoLoader} from '@ngneat/transloco';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import * as fs from 'fs';

@Injectable({providedIn: 'root'})
export class TranslocoFileSystemLoader implements TranslocoLoader {
  getTranslation(langPath: string): Observable<Translation> {
    const fName = langPath.toLowerCase();
    console.log('getTranslation', fName);

    const content = String(fs.readFileSync(`${__dirname}/../browser/assets/i18n/${fName}.json`));
    return of(content as any);
  }
}
