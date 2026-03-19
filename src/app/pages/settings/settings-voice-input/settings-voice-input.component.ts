import {Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {IonBackButton, IonContent, IonHeader} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-voice-input',
  templateUrl: './settings-voice-input.component.html',
  styleUrls: ['./settings-voice-input.component.scss'],
  imports: [TranslocoDirective, IonHeader, IonContent, IonBackButton],
})
export class SettingsVoiceInputComponent {}
