import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsOfflineComponent} from './settings-offline/settings-offline.component';
import {SettingsAboutComponent} from './settings-about/settings-about.component';
import {SettingsVoiceInputComponent} from './settings-voice-input/settings-voice-input.component';
import {SettingsVoiceOutputComponent} from './settings-voice-output/settings-voice-output.component';
import {SettingsFeedbackComponent} from './settings-feedback/settings-feedback.component';
import {SettingsAppearanceComponent} from './settings-appearance/settings-appearance.component';

const routes: Routes = [
  {path: 'feedback', component: SettingsFeedbackComponent},
  {path: 'about', component: SettingsAboutComponent},
  {path: 'input', component: SettingsVoiceInputComponent},
  {path: 'output', component: SettingsVoiceOutputComponent},
  {path: 'offline', component: SettingsOfflineComponent},
  {path: 'appearance', component: SettingsAppearanceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
