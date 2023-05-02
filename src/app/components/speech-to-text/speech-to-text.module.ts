import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';

import {SpeechToTextComponent} from './speech-to-text.component';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule, AppTranslocoModule, IonicModule, MatTooltipModule],
  declarations: [SpeechToTextComponent],
  exports: [SpeechToTextComponent],
})
export class SpeechToTextModule {}
