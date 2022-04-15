import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {AnimationState} from './animation.state';
import {AnimationService} from './animation.service';

@NgModule({
  declarations: [],
  providers: [AnimationService],
  imports: [NgxsModule.forFeature([AnimationState])],
})
export class AnimationModule {}
