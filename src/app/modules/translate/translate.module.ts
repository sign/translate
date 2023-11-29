import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {TranslateState} from './translate.state';
import {TranslationService} from './translate.service';
import {SignWritingTranslationService} from './signwriting-translation.service';
import {LanguageDetectionService} from './language-detection/language-detection.service';
import {CLD3LanguageDetectionService} from './language-detection/cld3.service';
import {MediaPipeLanguageDetectionService} from './language-detection/mediapipe.service';

@NgModule({
  providers: [
    TranslationService,
    SignWritingTranslationService,
    {provide: LanguageDetectionService, useClass: MediaPipeLanguageDetectionService},
  ],
  imports: [NgxsModule.forFeature([TranslateState])],
})
export class TranslateModule {}
