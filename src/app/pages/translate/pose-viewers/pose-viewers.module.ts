import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {IonicModule} from '@ionic/angular';
import {ViewerSelectorComponent} from './viewer-selector/viewer-selector.component';
import {AvatarPoseViewerComponent} from './avatar-pose-viewer/avatar-pose-viewer.component';
import {SkeletonPoseViewerComponent} from './skeleton-pose-viewer/skeleton-pose-viewer.component';
import {HumanPoseViewerComponent} from './human-pose-viewer/human-pose-viewer.component';
import {AnimationModule} from '../../../components/animation/animation.module';
import {AppSharedModule} from '../../../core/modules/shared.module';
import {MatTooltipModule} from '@angular/material/tooltip';

const components = [
  ViewerSelectorComponent,
  AvatarPoseViewerComponent,
  SkeletonPoseViewerComponent,
  HumanPoseViewerComponent,
];

@NgModule({
  imports: [AppSharedModule, IonicModule, AnimationModule, MatTooltipModule],
  declarations: components,
  exports: components,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PoseViewersModule {}
