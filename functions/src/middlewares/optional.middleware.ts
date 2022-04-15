import { RequestHandler } from 'express';
import * as functions from 'firebase-functions';

export const optionalMiddleware = (middleware: RequestHandler) => {
  const handler: RequestHandler = async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (e: any) {
      functions.logger.log('Skipping', e.message);
      next();
    }
  };

  return handler;
};
