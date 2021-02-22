import {NgModule} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NgxsModule, NgxsModuleOptions} from '@ngxs/store';
import {AppState} from './store/app/app.state';
import {SettingsState} from './store/settings/settings.state';
import {VideoState} from './store/video/video.state';
import {AudioState} from './store/audio/audio.state';


export const ngxsConfig: NgxsModuleOptions = {
  developmentMode: !environment.production,
  selectorOptions: {
    // These Selector Settings are recommended in preparation for NGXS v4
    // (See above for their effects)
    suppressErrors: false,
    injectContainerState: false
  },
  compatibility: {
    strictContentSecurityPolicy: true
  }
};

@NgModule({
  imports: [
    NgxsModule.forRoot([AppState, SettingsState, VideoState, AudioState], ngxsConfig)
  ]
})
export class AppNgxsModule {
}
