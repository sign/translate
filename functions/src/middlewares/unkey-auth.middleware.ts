import {Unkey} from '@unkey/api';
import * as httpErrors from 'http-errors';
import {NextFunction, Request, Response} from 'express';
import {V2KeysVerifyKeyResponseBody} from '@unkey/api/dist/commonjs/models/components';
import {defineString} from 'firebase-functions/params';

const unkeyRootKey = defineString('UNKEY_ROOT_KEY');
const unkey = new Unkey({rootKey: unkeyRootKey.value()});

export async function unkeyAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  let key = authHeader?.toString().replace('Bearer ', '');

  if (!key) {
    key = req.query.token as string;
  }

  if (!key) {
    throw new httpErrors.BadRequest('Missing/invalid API key');
  }

  let result!: V2KeysVerifyKeyResponseBody;
  try {
    result = await unkey.keys.verifyKey({key});
  } catch (err) {
    // This may happen on network errors
    console.log(err);
    throw new httpErrors.InternalServerError('Could not verify API key, please try again later');
  }

  if (!result.data.valid) {
    throw new httpErrors.Unauthorized('Invalid API key');
  }

  if (!result?.data.identity?.id) {
    throw new httpErrors.Forbidden('API key does not have an owner. Please contact support.');
  }

  res.locals.unkey = result;

  return next();
}
