import {Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {IonBackButton, IonContent, IonHeader} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-voice-output',
  templateUrl: './settings-voice-output.component.html',
  styleUrls: ['./settings-voice-output.component.scss'],
  imports: [TranslocoDirective, IonHeader, IonBackButton, IonContent],
})
export class SettingsVoiceOutputComponent {}
