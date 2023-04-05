import {NgModule} from '@angular/core';

import {TextToSpeechModule} from '../../../components/text-to-speech/text-to-speech.module';
import {SignWritingModule} from '../signwriting/signwriting.module';
import {SignedToSpokenComponent} from './signed-to-spoken.component';
import {UploadComponent} from './upload/upload.component';
import {VideoModule} from '../../../components/video/video.module';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

const componentModules = [VideoModule, SignWritingModule, TextToSpeechModule];

@NgModule({
  imports: [CommonModule, IonicModule, ...componentModules],
  declarations: [SignedToSpokenComponent, UploadComponent],
  exports: [SignedToSpokenComponent],
})
export class SignedToSpokenModule {}
