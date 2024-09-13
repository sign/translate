import {Application, Request, Response} from 'express';
import {paths} from './utils';

export function me(app: Application) {
  app.get(paths('me'), (req: Request, res: Response) => {
    const {unkey} = res.locals;
    const info: any = {
      keyId: unkey.keyId,
      name: unkey.name,
      expires: new Date(unkey.expires),
      rateLimit: null,
      enabled: unkey.enabled,
      permissions: unkey.permissions,
    };
    if (unkey.ratelimit) {
      info.rateLimit = {
        limit: unkey.ratelimit.limit,
        remaining: unkey.ratelimit.remaining,
        reset: new Date(unkey.ratelimit.reset),
      };
    }
    res.json(info);
  });
}
