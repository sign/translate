import * as admin from 'firebase-admin';
admin.initializeApp({ projectId: process.env.GOOGLE_CLOUD_PROJECT });

import { prerenderFunctions } from './controllers/prerender';

module.exports = {
  translate: {
    prerender: prerenderFunctions,
  },
};
