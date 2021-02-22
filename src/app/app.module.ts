import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppSharedModule} from './core/modules/shared.module';
import {HeaderComponent} from './components/header/header.component';
import {VideoComponent} from './components/video/video.component';
import {SettingsComponent} from './components/settings/settings.component';
import {VideoControlsComponent} from './components/video/video-controls/video-controls.component';
import {NavigatorService} from './core/services/navigator/navigator.service';
import {AudioComponent} from './components/audio/audio.component';
import {PoseModule} from './modules/pose/pose.module';
import {HandsModule} from './modules/hands/hands.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VideoComponent,
    SettingsComponent,
    VideoControlsComponent,
    AudioComponent
  ],
  imports: [
    BrowserModule,
    AppSharedModule,
    PoseModule,
    HandsModule
  ],
  providers: [
    NavigatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
