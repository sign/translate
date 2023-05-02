import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from './not-found.component';
import {RouterModule} from '@angular/router';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    AppTranslocoModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotFoundComponent,
      },
    ]),
  ],
  declarations: [NotFoundComponent],
})
export class NotFoundPageModule {}
