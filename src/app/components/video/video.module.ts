import {NgModule} from '@angular/core';
import {VideoComponent} from './video.component';
import {provideStates} from '@ngxs/store';
import {VideoState} from '../../core/modules/ngxs/store/video/video.state';
import {DetectorState} from '../../modules/detector/detector.state';
import {SignWritingState} from '../../modules/sign-writing/sign-writing.state';
import {PoseState} from '../../modules/pose/pose.state';

@NgModule({
  exports: [VideoComponent],
  imports: [VideoComponent],
  providers: [provideStates([VideoState, SignWritingState, PoseState, DetectorState])],
})
export class VideoModule {}
