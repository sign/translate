import {verifyKey} from '@unkey/api';
import * as httpErrors from 'http-errors';
import {NextFunction, Request, Response} from 'express';

export async function unkeyAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  let key = authHeader?.toString().replace('Bearer ', '');

  if (!key) {
    key = req.query.token as string;
  }

  if (!key) {
    throw new httpErrors.BadRequest('Missing/invalid API key');
  }

  const {result, error} = await verifyKey(key);
  if (error) {
    // This may happen on network errors
    throw new httpErrors.InternalServerError('Could not verify API key, please try again later');
  }

  if (!result.valid) {
    throw new httpErrors.Unauthorized('Invalid API key');
  }

  if (!result.ownerId) {
    throw new httpErrors.Forbidden('API key does not have an owner. Please contact support.');
  }

  res.locals.unkey = result;

  return next();
}
