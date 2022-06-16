import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {DetectorState} from './detector.state';
import {DetectorService} from './detector.service';

@NgModule({
  declarations: [],
  providers: [DetectorService],
  imports: [NgxsModule.forFeature([DetectorState])],
})
export class DetectorModule {}
