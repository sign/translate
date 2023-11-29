import {NgModule} from '@angular/core';

import {RouterModule} from '@angular/router';
import {BenchmarkComponent} from './benchmark.component';
import {BenchmarkItemComponent} from './benchmark-item/benchmark-item.component';
import {AppGoogleAnalyticsModule} from '../../core/modules/google-analytics/google-analytics.module';
import {AppSharedModule} from '../../core/modules/shared.module';
import {IonicModule} from '@ionic/angular';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '../../modules/translate/translate.module';

const routes = [
  {
    path: '',
    component: BenchmarkComponent,
  },
];

@NgModule({
  imports: [
    AppSharedModule,
    TranslateModule,
    MatTooltipModule,
    IonicModule,
    RouterModule.forChild(routes),
    AppGoogleAnalyticsModule,
  ],
  declarations: [BenchmarkComponent, BenchmarkItemComponent],
})
export class BenchmarkPageModule {}
