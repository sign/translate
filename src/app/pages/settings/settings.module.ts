import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsPageComponent} from './settings.component';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {SettingsFeedbackComponent} from './settings-feedback/settings-feedback.component';
import {SettingsAboutComponent} from './settings-about/settings-about.component';
import {SettingsVoiceInputComponent} from './settings-voice-input/settings-voice-input.component';
import {SettingsVoiceOutputComponent} from './settings-voice-output/settings-voice-output.component';
import {SettingsOfflineComponent} from './settings-offline/settings-offline.component';
import {SettingsAppearanceComponent} from './settings-appearance/settings-appearance.component';
import {MatTreeModule} from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import {NgxFilesizeModule} from 'ngx-filesize';
import {IonicModule} from '@ionic/angular';
import {SettingsMenuComponent} from './settings-menu/settings-menu.component';
import {SettingsAppearanceImagesComponent} from './settings-appearance/settings-appearance-images/settings-appearance-images.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    SettingsPageComponent,
    SettingsOfflineComponent,
    SettingsAppearanceComponent,
    SettingsFeedbackComponent,
    SettingsAboutComponent,
    SettingsVoiceInputComponent,
    SettingsVoiceOutputComponent,
    SettingsMenuComponent,
    SettingsAppearanceImagesComponent,
  ],
  imports: [
    CommonModule,
    AppTranslocoModule,
    SettingsRoutingModule,
    NgxFilesizeModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    CdkTreeModule,
    IonicModule,
  ],
  bootstrap: [SettingsPageComponent],
  exports: [SettingsAppearanceComponent, SettingsAppearanceImagesComponent],
})
export class SettingsPageModule {}
