import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsPageComponent} from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsPageComponent,
    // children: [
    //   {path: 'feedback', component: SettingsFeedbackComponent},
    //   {path: 'about', component: SettingsAboutComponent},
    //   {path: 'input', component: SettingsVoiceInputComponent},
    //   {path: 'output', component: SettingsVoiceOutputComponent},
    //   {path: 'offline', component: SettingsOfflineComponent},
    //   {path: 'appearance', component: SettingsAppearanceComponent},
    //   {path: '', redirectTo: 'feedback', pathMatch: 'full'}
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
