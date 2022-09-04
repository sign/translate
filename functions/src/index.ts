import * as admin from 'firebase-admin';
admin.initializeApp({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  databaseURL: 'https://sign-mt-default-rtdb.firebaseio.com/',
});

import {prerenderFunctions} from './prerender/controller';
import {textToTextFunctions} from './text-to-text/controller';

module.exports = {
  translate: {
    prerender: prerenderFunctions(),
    textToText: textToTextFunctions(admin.database(), admin.storage() as any),
  },
};
