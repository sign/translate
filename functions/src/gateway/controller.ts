import * as express from 'express';
import {Application, NextFunction, Request, Response} from 'express';

import * as cors from 'cors';
import {errorMiddleware} from '../middlewares/error.middleware';
import {onRequest} from 'firebase-functions/v2/https';
import {unkeyAuth} from './middleware';
import {HttpsOptions} from 'firebase-functions/lib/v2/providers/https';
import {getAppCheck} from 'firebase-admin/app-check';
import {createProxyMiddleware} from 'http-proxy-middleware';

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

  return next();
}

// API Documentation: https://app.swaggerhub.com/apis/AmitMoryossef/sign_mt/
const app: Application = express();
app.use(cors());
app.use(unkeyAuth);
app.use(getAppCheckKey);
app.options('*', (req, res) => res.status(200).end());

app.get(['/me', '/api/v1/me'], (req: Request, res: Response) => {
  const {unkey} = res.locals;
  res.json({
    keyId: unkey.keyId,
    name: unkey.name,
    expires: new Date(unkey.expires),
    rateLimit: {
      limit: unkey.ratelimit.limit,
      remaining: unkey.ratelimit.remaining,
      reset: new Date(unkey.ratelimit.reset),
    },
    enabled: unkey.enabled,
    permissions: unkey.permissions,
  });
});

app.use(
  ['/spoken-text-to-signed-pose', '/api/v1/spoken-text-to-signed-pose'],
  createProxyMiddleware({
    target: 'https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose',
    changeOrigin: true,
  })
);

app.use(errorMiddleware);

const reqOpts: HttpsOptions = {
  invoker: 'public',
  concurrency: 100,
  timeoutSeconds: 30,
};
export const gatewayFunction = onRequest(reqOpts, app);
