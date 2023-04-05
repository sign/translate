import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AnimationComponent} from './animation.component';

@NgModule({
  declarations: [AnimationComponent],
  exports: [AnimationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnimationModule {}
