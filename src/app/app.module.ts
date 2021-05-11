import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

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
import {AnimationModule} from './modules/animation/animation.module';
import {AnimationComponent} from './components/animation/animation.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VideoComponent,
    VideoControlsComponent,
    AnimationComponent,
  ],
  imports: [
    BrowserModule,
    AppSharedModule,
    SettingsModule,
    PoseModule,
    SignWritingModule,
    DetectorModule,
    AnimationModule
  ],
  providers: [
    NavigatorService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
