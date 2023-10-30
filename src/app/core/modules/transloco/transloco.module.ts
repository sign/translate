import {isDevMode, NgModule} from '@angular/core';
import {provideTransloco, TranslocoModule} from '@ngneat/transloco';
import {HttpLoader, translocoScopes} from './transloco.loader';
import {HttpClientModule} from '@angular/common/http';
import {SITE_LANGUAGES} from './languages';

@NgModule({
  imports: [HttpClientModule],
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: SITE_LANGUAGES.map(l => l.key),
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: HttpLoader,
    }),
    translocoScopes,
  ],
})
export class AppTranslocoModule {}
