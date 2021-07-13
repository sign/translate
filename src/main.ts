import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {defineCustomElements as defineCustomElementsSW} from '@sutton-signwriting/sgnw-components/loader';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {defineCustomElements as defineCustomElementsPoseViewer} from 'pose-viewer/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

defineCustomElementsSW();
defineCustomElementsPoseViewer();
