import {NgModule} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {TRANSLOCO_CONFIG, translocoConfig, TranslocoModule} from '@ngneat/transloco';
import {translocoScopes} from './transloco.loader';
import {HttpClientModule} from '@angular/common/http';
import {SITE_LANGUAGES} from '../../../components/language-selector/language-selector.component';

@NgModule({
  imports: [HttpClientModule],
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: SITE_LANGUAGES.map(l => l.key),
        defaultLang: 'en',
        fallbackLang: 'en',
        prodMode: environment.production,
        reRenderOnLangChange: true,
      }),
    },
    translocoScopes,
  ],
})
export class AppTranslocoModule {}
