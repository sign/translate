import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from './settings.state';
import {SettingsComponent} from './settings/settings.component';
import {AppSharedModule} from '../../core/modules/shared.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [SettingsComponent],
  providers: [],
  imports: [NgxsModule.forFeature([SettingsState]), AppSharedModule, FormsModule],
  exports: [SettingsComponent],
})
export class SettingsModule {}
