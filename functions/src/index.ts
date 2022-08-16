import * as admin from 'firebase-admin';
admin.initializeApp({projectId: process.env.GOOGLE_CLOUD_PROJECT});

import {prerenderFunctions} from './prerender/controller';
import {textToTextFunctions} from './text-to-text/controller';

module.exports = {
  translate: {
    prerender: prerenderFunctions(),
    textToText: textToTextFunctions(admin.storage() as any),
  },
};
