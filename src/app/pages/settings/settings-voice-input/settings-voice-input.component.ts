import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@jsverse/transloco';
import {IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-voice-input',
  templateUrl: './settings-voice-input.component.html',
  styleUrls: ['./settings-voice-input.component.scss'],
  imports: [TranslocoDirective, TranslocoPipe, IonToolbar, IonTitle, IonHeader, IonContent, IonBackButton, IonButtons],
})
export class SettingsVoiceInputComponent {}
