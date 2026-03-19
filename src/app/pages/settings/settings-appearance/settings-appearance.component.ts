import {Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {SettingsAppearanceImagesComponent} from './settings-appearance-images/settings-appearance-images.component';
import {IonBackButton, IonContent, IonHeader} from '@ionic/angular/standalone';

@Component({
  templateUrl: './settings-appearance.component.html',
  selector: 'app-settings-appearance',
  styleUrls: ['./settings-appearance.component.scss'],
  imports: [TranslocoDirective, SettingsAppearanceImagesComponent, IonHeader, IonContent, IonBackButton],
})
export class SettingsAppearanceComponent {}
