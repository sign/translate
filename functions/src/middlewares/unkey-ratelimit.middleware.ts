import {Duration, Ratelimit, RatelimitResponse} from '@unkey/ratelimit';
import * as httpErrors from 'http-errors';
import * as requestIp from 'request-ip';
import {NextFunction, Request, Response} from 'express';
import {defineString} from 'firebase-functions/params';
import {createHash} from 'crypto';

export function rateLimitHeaders(res: Response, ratelimitResponse: RatelimitResponse, duration?: Duration) {
  res.setHeader('X-RateLimit-Limit', ratelimitResponse.limit.toString());
  res.setHeader('X-RateLimit-Remaining', ratelimitResponse.remaining.toString());
  res.setHeader('X-RateLimit-Reset', ratelimitResponse.reset.toString());
  if (duration) {
    res.setHeader('X-RateLimit-Policy', `${ratelimitResponse.limit};w=${duration}`);
  }
}

export function unkeyRatelimit(namespace: string, limit: number, duration: Duration) {
  const unkeyRootKey = defineString('UNKEY_ROOT_KEY');

  return async function (req: Request, res: Response, next: NextFunction) {
    const rawIdentifier = requestIp.getClientIp(req) ?? 'unknown';
    const saltedIdentifier = rawIdentifier + unkeyRootKey.value();
    const identifier = createHash('sha256').update(saltedIdentifier).digest('hex');

    const rateLimit = new Ratelimit({
      rootKey: unkeyRootKey.value(),
      namespace,
      limit,
      duration,
      async: true,
    });

    const ratelimitResponse = await rateLimit.limit(identifier);
    rateLimitHeaders(res, ratelimitResponse, duration);

    if (!ratelimitResponse.success) {
      throw new httpErrors.TooManyRequests('Too many requests, please try again later');
    }

    return next();
  };
}
