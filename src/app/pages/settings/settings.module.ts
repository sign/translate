import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsPageComponent} from './settings.component';
import {SettingsOfflineComponent} from './offline/offline.component';
import {SettingsAppearanceComponent} from './appearance/appearance.component';
import {SettingsModule} from '../../modules/settings/settings.module';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {AppAngularMaterialModule} from '../../core/modules/angular-material/angular-material.module';

export {SettingsPageComponent};

@NgModule({
  declarations: [SettingsPageComponent, SettingsOfflineComponent, SettingsAppearanceComponent],
  imports: [
    CommonModule,
    AppTranslocoModule,
    AppAngularMaterialModule,
    SettingsRoutingModule,
    // SettingsModule,
  ],
  bootstrap: [SettingsPageComponent],
})
export class SettingsPageModule {}
