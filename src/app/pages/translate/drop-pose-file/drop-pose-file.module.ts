import {NgModule} from '@angular/core';
import {DropPoseFileComponent} from './drop-pose-file.component';
import {DropzoneDirective} from '../../../directives/dropzone.directive';

@NgModule({
  imports: [],
  declarations: [DropPoseFileComponent, DropzoneDirective],
  exports: [DropPoseFileComponent],
})
export class DropPoseFileModule {}
