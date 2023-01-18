import * as admin from 'firebase-admin';
admin.initializeApp({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  databaseURL: 'https://sign-mt-default-rtdb.firebaseio.com/',
});

import * as functions from 'firebase-functions';
import {prerenderFunctions} from './prerender/controller';
import {textToTextFunctions} from './text-to-text/controller';
import {logConsoleMemory} from './utils/memory';

logConsoleMemory(process.env.NODE_ENV === 'production' ? functions.logger : console);

module.exports = {
  translate: {
    prerender: prerenderFunctions(),
    textToText: textToTextFunctions(admin.database(), admin.storage() as any),
  },
};
