import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AnimationComponent} from './animation.component';
import {NgxsModule, provideStates} from '@ngxs/store';
import {AnimationState} from '../../modules/animation/animation.state';

@NgModule({
  exports: [AnimationComponent],
  imports: [AnimationComponent],
  providers: [provideStates([AnimationState])],
})
export class AnimationModule {}
