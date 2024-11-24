import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@ngneat/transloco';
import {IonicModule} from '@ionic/angular';
import {SettingsAppearanceImagesComponent} from './settings-appearance-images/settings-appearance-images.component';

@Component({
  templateUrl: './settings-appearance.component.html',
  selector: 'app-settings-appearance',
  styleUrls: ['./settings-appearance.component.scss'],
  imports: [TranslocoDirective, IonicModule, SettingsAppearanceImagesComponent, TranslocoPipe],
})
export class SettingsAppearanceComponent {}
