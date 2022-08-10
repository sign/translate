import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsPageComponent} from './settings.component';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {AppAngularMaterialModule} from '../../core/modules/angular-material/angular-material.module';
import {SettingsFeedbackComponent} from './settings-feedback/settings-feedback.component';
import {SettingsAboutComponent} from './settings-about/settings-about.component';
import {SettingsVoiceInputComponent} from './settings-voice-input/settings-voice-input.component';
import {SettingsVoiceOutputComponent} from './settings-voice-output/settings-voice-output.component';
import {SettingsOfflineComponent} from './settings-offline/settings-offline.component';
import {SettingsAppearanceComponent} from './settings-appearance/settings-appearance.component';
import {MatTreeModule} from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import {NgxFilesizeModule} from 'ngx-filesize';

export {SettingsPageComponent};

@NgModule({
  declarations: [
    SettingsPageComponent,
    SettingsOfflineComponent,
    SettingsAppearanceComponent,
    SettingsFeedbackComponent,
    SettingsAboutComponent,
    SettingsVoiceInputComponent,
    SettingsVoiceOutputComponent,
  ],
  imports: [
    CommonModule,
    AppTranslocoModule,
    AppAngularMaterialModule,
    SettingsRoutingModule,
    NgxFilesizeModule,
    MatTreeModule,
    CdkTreeModule,
  ],
  bootstrap: [SettingsPageComponent],
})
export class SettingsPageModule {}
