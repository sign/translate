import { NgModule } from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {HandsState} from './hands.state';
import {HandsService} from './hands.service';



@NgModule({
  declarations: [],
  providers: [HandsService],
  imports: [
    NgxsModule.forFeature([HandsState])
  ]
})
export class HandsModule { }
