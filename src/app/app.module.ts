import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppSharedModule} from './core/modules/shared.module';
import {VideoComponent} from './components/video/video.component';
import {VideoControlsComponent} from './components/video/video-controls/video-controls.component';
import {NavigatorService} from './core/services/navigator/navigator.service';
import {PoseModule} from './modules/pose/pose.module';
import {SignWritingModule} from './modules/sign-writing/sign-writing.module';
import {SettingsModule} from './modules/settings/settings.module';
import {DetectorModule} from './modules/detector/detector.module';
import {AnimationModule} from './modules/animation/animation.module';
import {AnimationComponent} from './components/animation/animation.component';
import {AppRoutingModule} from './app-routing.module';
import {PlaygroundComponent} from './pages/playground/playground.component';
import {TranslateComponent} from './pages/translate/translate.component';
import {NgxFlagIconCssModule} from 'ngx-flag-icon-css';


@NgModule({
  declarations: [
    AppComponent,
    VideoComponent,
    VideoControlsComponent,
    AnimationComponent,
    PlaygroundComponent,
    TranslateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppSharedModule,
    SettingsModule,
    PoseModule,
    SignWritingModule,
    DetectorModule,
    AnimationModule,
    NgxFlagIconCssModule,
  ],
  providers: [
    NavigatorService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
