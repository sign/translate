import {NgModule} from '@angular/core';
import {AnimationComponent} from './animation.component';
import {provideStates} from '@ngxs/store';
import {AnimationState} from '../../modules/animation/animation.state';

@NgModule({
  exports: [AnimationComponent],
  imports: [AnimationComponent],
  providers: [provideStates([AnimationState])],
})
export class AnimationModule {}
