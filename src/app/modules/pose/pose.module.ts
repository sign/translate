import {NgModule} from '@angular/core';
import {PoseService} from './pose.service';
import {NgxsModule} from '@ngxs/store';
import {PoseState} from './pose.state';
import {PoseNormalizationService} from './pose-normalization.service';

@NgModule({
  declarations: [],
  providers: [PoseService, PoseNormalizationService],
  imports: [NgxsModule.forFeature([PoseState])],
})
export class PoseModule {}
