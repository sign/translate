import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@jsverse/transloco';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-feedback',
  templateUrl: './settings-feedback.component.html',
  styleUrls: ['./settings-feedback.component.scss'],
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonBackButton,
    IonButtons,
    IonContent,
  ],
})
export class SettingsFeedbackComponent {}
