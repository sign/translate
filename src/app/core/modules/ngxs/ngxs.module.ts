import {NgModule} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NgxsModule, NgxsModuleOptions} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';

export const ngxsConfig: NgxsModuleOptions = {
  developmentMode: !environment.production,
  selectorOptions: {
    // These Selector Settings are recommended in preparation for NGXS v4
    // (See above for their effects)
    suppressErrors: false,
    injectContainerState: false,
  },
  compatibility: {
    strictContentSecurityPolicy: true,
  },
};

@NgModule({
  imports: [NgxsModule.forRoot([SettingsState], ngxsConfig)],
})
export class AppNgxsModule {}
