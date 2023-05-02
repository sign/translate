import {Component} from '@angular/core';
import {SettingsOfflineComponent} from '../settings-offline/settings-offline.component';
import {SettingsAboutComponent} from '../settings-about/settings-about.component';
import {SettingsVoiceInputComponent} from '../settings-voice-input/settings-voice-input.component';
import {SettingsVoiceOutputComponent} from '../settings-voice-output/settings-voice-output.component';
import {SettingsFeedbackComponent} from '../settings-feedback/settings-feedback.component';
import {SettingsAppearanceComponent} from '../settings-appearance/settings-appearance.component';

interface Page {
  path: string;
  icon: string;
  component: any;
}

interface PagesGroup {
  name: string;
  pages: Page[];
}

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent {
  groups: PagesGroup[] = [
    {
      name: 'support',
      pages: [
        {path: 'feedback', icon: 'chatbubbles', component: SettingsFeedbackComponent},
        {path: 'about', icon: 'information-circle', component: SettingsAboutComponent},
      ],
    },
    {
      name: 'voice',
      pages: [
        {path: 'input', icon: 'mic', component: SettingsVoiceInputComponent},
        {path: 'output', icon: 'volume-medium', component: SettingsVoiceOutputComponent},
      ],
    },
    {
      name: 'other',
      pages: [
        {path: 'offline', icon: 'airplane', component: SettingsOfflineComponent},
        {path: 'appearance', icon: 'person-circle', component: SettingsAppearanceComponent},
      ],
    },
  ];
}
