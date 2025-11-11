import {HttpClient} from '@angular/common/http';
import {Translation, TRANSLOCO_SCOPE, TranslocoLoader} from '@jsverse/transloco';
import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';

import {catchError, Observable, of} from 'rxjs';
import {BUILD_VERSION} from '../../../../build-version';

@Injectable({providedIn: 'root'})
export class HttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  getTranslation(langPath: string): Observable<Translation> {
    // Check if running in Node.js (server-side/prerendering)
    if (isPlatformServer(this.platformId)) {
      return of(this.getTranslationServer(langPath));
    }

    // Browser environment: use HTTP with cache buster (timestamp generated at build time)
    const assetPath = `assets/i18n/${langPath}.json?v=${BUILD_VERSION}`;
    return this.http.get<Translation>(assetPath).pipe(
      catchError(err => {
        console.error(`Couldn't load translation file '${assetPath}'`, err);
        throw err;
      })
    );
  }

  getTranslationServer(langPath: string): Translation {
    try {
      // Use dynamic import to avoid bundling fs in browser
      const fs = require('fs');
      const path = require('path');

      // Try source path first (for ng serve), then dist path (for production build)
      const possiblePaths = [
        // For development server
        path.join(process.cwd(), 'src', 'assets', 'i18n', `${langPath}.json`),
        path.join(process.cwd(), 'node_modules', '@sign-mt', 'i18n', 'build', `${langPath}.json`),
        // For production build
        path.join(process.cwd(), 'dist/browser', 'assets', 'i18n', `${langPath}.json`),
      ];

      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(fileContent);
        }
      }

      throw new Error(`Translation file not found in any of the expected locations: ${possiblePaths.join(', ')}`);
    } catch (err) {
      console.error(`Couldn't load translation file '${langPath}' during prerendering`, err);
      throw err;
    }
  }
}

export const translocoScopes = {
  provide: TRANSLOCO_SCOPE,
  useValue: ['', 'countries', 'languages', 'signedLanguagesShort'],
};
