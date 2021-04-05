import {NgModule} from '@angular/core';
import {PoseService} from './pose.service';
import {NgxsModule} from '@ngxs/store';
import {PoseState} from './pose.state';


@NgModule({
  declarations: [],
  providers: [PoseService],
  imports: [
    NgxsModule.forFeature([PoseState])
  ]
})
export class PoseModule {
}
