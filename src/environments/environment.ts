// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import type {InitialNavigation} from '@angular/router';

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAtVDGmDVCwWunWW2ocgeHWnAsUhHuXvcg',
    authDomain: 'sign-mt.firebaseapp.com',
    projectId: 'sign-mt',
    storageBucket: 'sign-mt.appspot.com',
    messagingSenderId: '665830225099',
    appId: '1:665830225099:web:18e0669d5847a4b047974e',
    measurementId: null,
  },
  reCAPTCHAKey: '6Ldsxb8oAAAAAGyUZbyd0QruivPSudqAWFygR-4t',
  initialNavigation: 'enabledBlocking' as InitialNavigation,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
