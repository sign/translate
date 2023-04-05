import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {IonicModule} from '@ionic/angular';
import {SignWritingComponent} from './sign-writing.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [SignWritingComponent],
  exports: [SignWritingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignWritingModule {}
