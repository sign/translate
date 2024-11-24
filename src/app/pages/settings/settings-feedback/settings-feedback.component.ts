import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@ngneat/transloco';
import {IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-settings-feedback',
  templateUrl: './settings-feedback.component.html',
  styleUrls: ['./settings-feedback.component.scss'],
  imports: [TranslocoDirective, IonicModule, TranslocoPipe],
})
export class SettingsFeedbackComponent {}
