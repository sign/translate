import {NgModule} from '@angular/core';

import {SpeechToTextComponent} from './speech-to-text.component';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';
import {IonButton, IonIcon} from '@ionic/angular/standalone';

@NgModule({
  imports: [CommonModule, AppTranslocoModule, IonIcon, IonButton, MatTooltipModule],
  declarations: [SpeechToTextComponent],
  exports: [SpeechToTextComponent],
})
export class SpeechToTextModule {}
