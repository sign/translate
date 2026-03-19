import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@jsverse/transloco';
import {IonBackButton, IonContent, IonHeader, IonItem, IonLabel, IonList} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-feedback',
  templateUrl: './settings-feedback.component.html',
  styleUrls: ['./settings-feedback.component.scss'],
  imports: [TranslocoDirective, TranslocoPipe, IonHeader, IonList, IonItem, IonLabel, IonBackButton, IonContent],
})
export class SettingsFeedbackComponent {}
