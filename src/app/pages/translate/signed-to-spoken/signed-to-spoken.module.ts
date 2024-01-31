import {NgModule} from '@angular/core';

import {TextToSpeechModule} from '../../../components/text-to-speech/text-to-speech.module';
import {SignWritingModule} from '../signwriting/signwriting.module';
import {SignedToSpokenComponent} from './signed-to-spoken.component';
import {UploadComponent} from './upload/upload.component';
import {VideoModule} from '../../../components/video/video.module';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AppTranslocoModule} from '../../../core/modules/transloco/transloco.module';
import {SignedLanguageInputComponent} from './signed-language-input/signed-language-input.component';
import {SpokenToSignedModule} from '../spoken-to-signed/spoken-to-signed.module';
import {MatTooltipModule} from '@angular/material/tooltip';

const componentModules = [VideoModule, SignWritingModule, TextToSpeechModule];

const components = [SignedToSpokenComponent, SignedLanguageInputComponent, UploadComponent];

@NgModule({
  imports: [CommonModule, AppTranslocoModule, IonicModule, MatTooltipModule, ...componentModules, SpokenToSignedModule],
  declarations: components,
  exports: components,
})
export class SignedToSpokenModule {}
