import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavigatorService} from './core/services/navigator/navigator.service';
import {AppRoutingModule} from './app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {isSafari} from './core/constants';
import {AppTranslocoModule} from './core/modules/transloco/transloco.module';
import {AppNgxsModule} from './core/modules/ngxs/ngxs.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const mode = isSafari ? 'ios' : 'md';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserAnimationsModule,
    IonicModule.forRoot({mode}),
    AppRoutingModule,
    AppTranslocoModule,
    AppNgxsModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [NavigatorService, {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
