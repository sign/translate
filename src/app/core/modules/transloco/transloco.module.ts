import {NgModule} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig, TranslocoModule} from '@ngneat/transloco';
import {HttpLoader, translocoScopes} from './transloco.loader';
import {HttpClientModule} from '@angular/common/http';
import {SITE_LANGUAGES} from './languages';

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
    {provide: TRANSLOCO_LOADER, useClass: HttpLoader},
    translocoScopes,
  ],
})
export class AppTranslocoModule {}
