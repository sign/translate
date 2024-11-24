import {NgModule} from '@angular/core';
import {VideoComponent} from './video.component';
import {VideoControlsComponent} from './video-controls/video-controls.component';
import {AnimationModule} from '../animation/animation.module';
import {NgxsModule} from '@ngxs/store';
import {VideoState} from '../../core/modules/ngxs/store/video/video.state';
import {CommonModule} from '@angular/common';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DetectorState} from '../../modules/detector/detector.state';
import {SignWritingState} from '../../modules/sign-writing/sign-writing.state';
import {PoseModule} from '../../modules/pose/pose.module';
import {IonFab, IonFabButton, IonIcon} from '@ionic/angular/standalone';

@NgModule({
  imports: [
    CommonModule,
    AnimationModule,
    AppTranslocoModule,
    MatTooltipModule,
    PoseModule,
    IonIcon,
    IonFab,
    IonFabButton,
    NgxsModule.forFeature([VideoState, SignWritingState, DetectorState]),
    VideoComponent,
    VideoControlsComponent,
  ],
  exports: [VideoComponent],
})
export class VideoModule {}
