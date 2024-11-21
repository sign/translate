import {Component} from '@angular/core';

@Component({
  selector: 'app-settings-about',
  templateUrl: './settings-about.component.html',
  styleUrls: ['./settings-about.component.scss'],
  standalone: false,
})
export class SettingsAboutComponent {
  legalPages: string[] = ['terms', 'privacy', 'licenses'];
}
