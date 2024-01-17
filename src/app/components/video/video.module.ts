import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
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

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AnimationModule,
    AppTranslocoModule,
    MatTooltipModule,
    PoseModule,
    NgxsModule.forFeature([VideoState, SignWritingState, DetectorState]),
  ],
  declarations: [VideoComponent, VideoControlsComponent],
  exports: [VideoComponent],
})
export class VideoModule {}
