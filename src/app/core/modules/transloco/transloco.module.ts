import {isDevMode, NgModule} from '@angular/core';
import {provideTransloco, TranslocoModule} from '@ngneat/transloco';
import {HttpLoader, translocoScopes} from './transloco.loader';
import {provideHttpClient} from '@angular/common/http';
import {SITE_LANGUAGES} from './languages';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: SITE_LANGUAGES.map(l => l.key),
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        missingHandler: {
          // It will use the first language set in the `fallbackLang` property
          useFallbackTranslation: true,
        },
      },
      loader: HttpLoader,
    }),
    translocoScopes,
    provideHttpClient(),
  ],
})
export class AppTranslocoModule {}
