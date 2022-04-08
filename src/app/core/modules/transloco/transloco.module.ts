import {NgModule} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {TRANSLOCO_CONFIG, TranslocoConfig, TranslocoModule} from '@ngneat/transloco';
import {translocoLoader, translocoScopes} from './transloco.loader';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    HttpClientModule,
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
    translocoLoader,
    translocoScopes,
  ],
})
export class AppTranslocoModule {
}
