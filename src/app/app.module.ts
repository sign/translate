import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppSharedModule} from './core/modules/shared.module';
import {HeaderComponent} from './components/header/header.component';
import {VideoComponent} from './components/video/video.component';
import {VideoControlsComponent} from './components/video/video-controls/video-controls.component';
import {NavigatorService} from './core/services/navigator/navigator.service';
import {PoseModule} from './modules/pose/pose.module';
import {SignWritingModule} from './modules/sign-writing/sign-writing.module';
import {SettingsModule} from './modules/settings/settings.module';
import {DetectorModule} from './modules/detector/detector.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VideoComponent,
    VideoControlsComponent,
  ],
  imports: [
    BrowserModule,
    AppSharedModule,
    SettingsModule,
    PoseModule,
    SignWritingModule,
    DetectorModule
  ],
  providers: [
    NavigatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
