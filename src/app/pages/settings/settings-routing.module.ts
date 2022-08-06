import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsOfflineComponent} from './offline/offline.component';
import {SettingsAppearanceComponent} from './appearance/appearance.component';

const routes: Routes = [
  {path: 'feedback', component: SettingsOfflineComponent},
  {path: 'about', component: SettingsOfflineComponent},
  {path: 'input', component: SettingsOfflineComponent},
  {path: 'output', component: SettingsOfflineComponent},
  {path: 'offline', component: SettingsOfflineComponent},
  {path: 'appearance', component: SettingsAppearanceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
