import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@jsverse/transloco';
import {SettingsAppearanceImagesComponent} from './settings-appearance-images/settings-appearance-images.component';
import {IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  templateUrl: './settings-appearance.component.html',
  selector: 'app-settings-appearance',
  styleUrls: ['./settings-appearance.component.scss'],
  imports: [
    TranslocoDirective,
    SettingsAppearanceImagesComponent,
    TranslocoPipe,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonBackButton,
    IonButtons,
  ],
})
export class SettingsAppearanceComponent {}
