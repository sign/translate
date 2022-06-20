import {NgModule} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule} from 'ngx-google-analytics';
import {GoogleAnalyticsTimingService} from './google-analytics.service';

@NgModule({
  imports: [NgxGoogleAnalyticsModule.forRoot(environment.firebase.measurementId), NgxGoogleAnalyticsRouterModule],
  exports: [],
  providers: [GoogleAnalyticsTimingService],
})
export class AppGoogleAnalyticsModule {}
