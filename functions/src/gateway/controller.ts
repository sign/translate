import * as express from 'express';
import {Application, NextFunction, Request, Response} from 'express';

import * as cors from 'cors';
import {errorMiddleware} from '../middlewares/error.middleware';
import {onRequest} from 'firebase-functions/v2/https';
import {unkeyAuth} from './middleware';
import {HttpsOptions} from 'firebase-functions/lib/v2/providers/https';
import {getAppCheck} from 'firebase-admin/app-check';
import {avatars} from './avatars';
import {me} from './me';
import {spokenToSigned} from './spoken-to-signed';

// The public APP ID of the sign-mt web app
const APP_ID = '1:665830225099:web:18e0669d5847a4b047974e';

// Create and cache an App Check token for the sign-mt web app
let appCheckAPIKey = Promise.resolve({token: '', expires: 0});

export async function getAppCheckKey(req: Request, res: Response, next: NextFunction) {
  async function safeGetToken() {
    // If there was a failure to get the token, reset the promise before trying again
    try {
      return await appCheckAPIKey;
    } catch (e) {
      appCheckAPIKey = Promise.resolve({token: '', expires: 0});
      throw e;
    }
  }

  let {token, expires} = await safeGetToken();
  if (expires < Date.now()) {
    appCheckAPIKey = getAppCheck()
      .createToken(APP_ID)
      .then(({token, ttlMillis}) => ({token, expires: Date.now() - 1000 + ttlMillis}));
    ({token, expires} = await safeGetToken());
  }

  res.locals.appCheckToken = token;
  res.locals.headers = {
    'X-Firebase-AppCheck': token,
    'X-AppCheck-Token': token,
  };

  return next();
}

// API Documentation: https://app.swaggerhub.com/apis/AmitMoryossef/sign_mt/
const app: Application = express();
app.use(cors());
app.use(unkeyAuth);
app.use(getAppCheckKey);
app.options('*', (req, res) => res.status(200).end());

spokenToSigned(app);
me(app);
avatars(app);

app.use(errorMiddleware);

const reqOpts: HttpsOptions = {
  invoker: 'public',
  concurrency: 100,
  timeoutSeconds: 60,
};
export const gatewayFunction = onRequest(reqOpts, app);
