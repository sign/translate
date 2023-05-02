import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AnimationComponent} from './animation.component';
import {NgxsModule} from '@ngxs/store';
import {AnimationState} from '../../modules/animation/animation.state';

@NgModule({
  declarations: [AnimationComponent],
  exports: [AnimationComponent],
  imports: [NgxsModule.forFeature([AnimationState])],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnimationModule {}
