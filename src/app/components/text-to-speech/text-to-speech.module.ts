import {NgModule} from '@angular/core';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TextToSpeechComponent} from './text-to-speech.component';
import {CommonModule} from '@angular/common';
import {IonButton, IonIcon} from '@ionic/angular/standalone';

@NgModule({
  imports: [CommonModule, AppTranslocoModule, IonIcon, IonButton, MatTooltipModule],
  declarations: [TextToSpeechComponent],
  exports: [TextToSpeechComponent],
})
export class TextToSpeechModule {}
