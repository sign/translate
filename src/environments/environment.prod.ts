import type {InitialNavigation} from '@angular/router';

export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyAtVDGmDVCwWunWW2ocgeHWnAsUhHuXvcg',
    authDomain: 'sign-mt.firebaseapp.com',
    projectId: 'sign-mt',
    storageBucket: 'sign-mt.appspot.com',
    messagingSenderId: '665830225099',
    appId: '1:665830225099:web:18e0669d5847a4b047974e',
    measurementId: 'G-1LXY5W5Z9H',
  },
  reCAPTCHAKey: '6Ldsxb8oAAAAAGyUZbyd0QruivPSudqAWFygR-4t',
  initialNavigation: 'enabledBlocking' as InitialNavigation,
};
