import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@ngneat/transloco';
import {IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-settings-voice-output',
  templateUrl: './settings-voice-output.component.html',
  styleUrls: ['./settings-voice-output.component.scss'],
  imports: [TranslocoDirective, IonicModule, TranslocoPipe],
})
export class SettingsVoiceOutputComponent {}
