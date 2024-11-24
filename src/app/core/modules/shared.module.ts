import {NgModule} from '@angular/core';
import {TensorflowService} from '../services/tfjs/tfjs.service';
import {ThreeService} from '../services/three.service';

const components = [];

const modules = [];

@NgModule({
  declarations: components,
  imports: modules,
  exports: [...components, ...modules],
  providers: [
    // ES Module Services
    TensorflowService,
    ThreeService,
  ],
})
export class AppSharedModule {}
