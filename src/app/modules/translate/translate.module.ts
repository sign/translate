import {NgModule} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {TranslateState} from './translate.state';
import {TranslationService} from './translate.service';

@NgModule({
  providers: [TranslationService],
  imports: [NgxsModule.forFeature([TranslateState])],
})
export class TranslateModule {}
