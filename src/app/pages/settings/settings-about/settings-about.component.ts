import {Component} from '@angular/core';
import {TranslocoDirective, TranslocoPipe} from '@ngneat/transloco';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-settings-about',
  templateUrl: './settings-about.component.html',
  styleUrls: ['./settings-about.component.scss'],
  imports: [TranslocoDirective, IonicModule, RouterLink, TranslocoPipe],
})
export class SettingsAboutComponent {
  legalPages: string[] = ['terms', 'privacy', 'licenses'];
}
