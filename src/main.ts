import {enableProdMode, provideZoneChangeDetection} from '@angular/core';
import {environment} from './environments/environment';
import {initializeApp} from 'firebase/app';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {bootstrapApplication} from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

initializeApp(environment.firebase);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [provideZoneChangeDetection(), ...appConfig.providers],
}).catch(err => console.error(err));
