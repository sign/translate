import {NgModule} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {TRANSLOCO_CONFIG, TranslocoConfig, TranslocoModule} from '@ngneat/transloco';
import {TranslocoMessageFormatModule} from '@ngneat/transloco-messageformat';
import {translocoLoader} from './transloco.loader';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    HttpClientModule,
    TranslocoMessageFormatModule.init(),
  ],
  exports: [
    TranslocoModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: ['en', 'he'],
        defaultLang: 'en',
        fallbackLang: 'en',
        prodMode: environment.production,
      } as TranslocoConfig
    },
    translocoLoader
  ],
})
export class AppTranslocoModule {
}
