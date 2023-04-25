import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {IonicServerModule} from '@ionic/angular-server';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {TRANSLOCO_LOADER} from '@ngneat/transloco';
import {TranslocoFileSystemLoader} from './core/modules/transloco/transloco.server.loader';

@NgModule({
  imports: [AppModule, ServerModule, IonicServerModule],
  bootstrap: [AppComponent],
  providers: [{provide: TRANSLOCO_LOADER, useClass: TranslocoFileSystemLoader}],
})
export class AppServerModule {}
