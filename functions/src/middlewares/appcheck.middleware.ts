import {RequestHandler} from 'express';

import {getAppCheck} from 'firebase-admin/app-check';
import * as httpErrors from 'http-errors';

export const appCheckVerification: RequestHandler = async (req, res, next) => {
  const appCheckToken = req.header('X-Appcheck-Token');

  if (!appCheckToken) {
    throw new httpErrors.Unauthorized('Missing App Check token');
  }

  try {
    await getAppCheck().verifyToken(appCheckToken);
    return next();
  } catch (err) {
    throw new httpErrors.Unauthorized('Invalid App Check token');
  }
};
