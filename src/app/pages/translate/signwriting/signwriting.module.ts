import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {IonicModule} from '@ionic/angular';
import {SignWritingComponent} from './sign-writing.component';
import {CommonModule} from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgxsModule} from '@ngxs/store';
import {TranslateState} from '../../../modules/translate/translate.state';

@NgModule({
  imports: [CommonModule, IonicModule, MatTooltipModule, NgxsModule.forFeature([TranslateState])],
  declarations: [SignWritingComponent],
  exports: [SignWritingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignWritingModule {}
