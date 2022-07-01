import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {Capacitor} from '@capacitor/core';
import {initializeApp} from 'firebase/app';

if (environment.production) {
  enableProdMode();
}

if (!Capacitor.isNativePlatform()) {
  initializeApp(environment.firebase);
}

function bootstrap() {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
