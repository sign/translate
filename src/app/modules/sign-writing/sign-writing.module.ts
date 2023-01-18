import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {HandsService} from './hands.service';
import {SignWritingState} from './sign-writing.state';
import {BodyService} from './body.service';
import {FaceService} from './face.service';

@NgModule({
  declarations: [],
  providers: [HandsService, BodyService, FaceService],
  imports: [NgxsModule.forFeature([SignWritingState])],
})
export class SignWritingModule {}
