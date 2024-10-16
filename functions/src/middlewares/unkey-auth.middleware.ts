import {verifyKey} from '@unkey/api';
import * as httpErrors from 'http-errors';
import {NextFunction, Request, Response} from 'express';
import {rateLimitHeaders} from './unkey-ratelimit.middleware';
import {RatelimitResponse} from '@unkey/ratelimit';

export async function unkeyAuth(req: Request, res: Response, next: NextFunction) {
  const apiId = 'api_4LtAUnGvWjPZGJV9hQDoJtum53GK'; // Public API ID

  const authHeader = req.headers['authorization'];
  let key = authHeader?.toString().replace('Bearer ', '');

  if (!key) {
    key = req.query.token as string;
  }

  if (!key) {
    throw new httpErrors.BadRequest('Missing/invalid API key');
  }

  const {result, error} = await verifyKey({key, apiId});
  if (error) {
    // This may happen on network errors
    throw new httpErrors.InternalServerError('Could not verify API key, please try again later');
  }

  if (result?.ratelimit) {
    rateLimitHeaders(res, result.ratelimit as RatelimitResponse);
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
