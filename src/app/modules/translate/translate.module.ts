import {NgModule} from '@angular/core';
import {NgxsModule, provideStore} from '@ngxs/store';
import {TranslateState} from './translate.state';
import {TranslationService} from './translate.service';
import {SignWritingTranslationService} from './signwriting-translation.service';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

@NgModule({
  providers: [
    TranslationService,
    SignWritingTranslationService,
    provideHttpClient(withInterceptorsFromDi()),
    // provideStore([TranslateState]),
  ],
  imports: [NgxsModule.forFeature([TranslateState])],
})
export class TranslateModule {}
