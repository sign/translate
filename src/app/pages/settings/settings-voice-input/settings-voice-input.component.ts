import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@ngneat/transloco';
import {IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-settings-voice-input',
  templateUrl: './settings-voice-input.component.html',
  styleUrls: ['./settings-voice-input.component.scss'],
  imports: [TranslocoDirective, IonicModule, TranslocoPipe],
})
export class SettingsVoiceInputComponent {}
