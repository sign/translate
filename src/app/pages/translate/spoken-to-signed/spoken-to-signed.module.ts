import {NgModule} from '@angular/core';

import {TextToSpeechModule} from '../../../components/text-to-speech/text-to-speech.module';
import {SpeechToTextModule} from '../../../components/speech-to-text/speech-to-text.module';
import {SpokenToSignedComponent} from './spoken-to-signed.component';
import {ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {SignWritingModule} from '../signwriting/signwriting.module';
import {PoseViewersModule} from '../pose-viewers/pose-viewers.module';
import {AppTranslocoModule} from '../../../core/modules/transloco/transloco.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';

const componentModules = [SpeechToTextModule, TextToSpeechModule, SignWritingModule, PoseViewersModule];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, AppTranslocoModule, MatTooltipModule, IonicModule, ...componentModules],
  declarations: [SpokenToSignedComponent],
  exports: [SpokenToSignedComponent],
})
export class SpokenToSignedModule {}
