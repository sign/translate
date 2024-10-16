import {NextFunction, Request, Response} from 'express';
import {getAppCheck} from 'firebase-admin/app-check';

// The public APP ID of the sign-mt web app
const APP_ID = '1:665830225099:web:18e0669d5847a4b047974e';

// Create and cache an App Check token for the sign-mt web app
let appCheckAPIKey = Promise.resolve({token: '', expires: 0});

export async function createAppCheckKey(req: Request, res: Response, next: NextFunction) {
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
