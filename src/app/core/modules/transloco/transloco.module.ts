import {isDevMode, NgModule} from '@angular/core';
import {provideTransloco, TranslocoModule} from '@ngneat/transloco';
import {HttpLoader, translocoScopes} from './transloco.loader';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {SITE_LANGUAGES} from './languages';

export const AppTranslocoProviders = [
  provideTransloco({
    config: {
      availableLangs: SITE_LANGUAGES.map(l => l.key),
      defaultLang: 'en',
      fallbackLang: 'en',
      reRenderOnLangChange: true,
      prodMode: true, // TODO !isDevMode(),
      missingHandler: {
        // It will use the first language set in the `fallbackLang` property
        useFallbackTranslation: true,
      },
    },
    loader: HttpLoader,
  }),
  translocoScopes,
];

@NgModule({
  exports: [TranslocoModule],
  providers: AppTranslocoProviders,
})
export class AppTranslocoModule {}
