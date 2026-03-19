import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@jsverse/transloco';
import {RouterLink} from '@angular/router';
import {IonBackButton, IonContent, IonHeader, IonItem, IonLabel, IonList} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-about',
  templateUrl: './settings-about.component.html',
  styleUrls: ['./settings-about.component.scss'],
  imports: [
    TranslocoDirective,
    RouterLink,
    TranslocoPipe,
    IonBackButton,
    IonHeader,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class SettingsAboutComponent {
  legalPages: string[] = ['terms', 'privacy', 'licenses'];
}
