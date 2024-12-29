import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@jsverse/transloco';
import {IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-voice-output',
  templateUrl: './settings-voice-output.component.html',
  styleUrls: ['./settings-voice-output.component.scss'],
  imports: [TranslocoDirective, TranslocoPipe, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent],
})
export class SettingsVoiceOutputComponent {}
