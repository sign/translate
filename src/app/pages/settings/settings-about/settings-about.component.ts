import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@jsverse/transloco';
import {RouterLink} from '@angular/router';
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
  selector: 'app-settings-about',
  templateUrl: './settings-about.component.html',
  styleUrls: ['./settings-about.component.scss'],
  imports: [
    TranslocoDirective,
    RouterLink,
    TranslocoPipe,
    IonTitle,
    IonBackButton,
    IonToolbar,
    IonHeader,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class SettingsAboutComponent {
  legalPages: string[] = ['terms', 'privacy', 'licenses'];
}
