import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TextToSpeechComponent} from './text-to-speech.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule, AppTranslocoModule, IonicModule, MatTooltipModule],
  declarations: [TextToSpeechComponent],
  exports: [TextToSpeechComponent],
})
export class TextToSpeechModule {}
