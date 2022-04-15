import {ErrorRequestHandler} from 'express';
// eslint-disable-next-line
import 'express-async-errors';

/**
 * General HTTP error middleware
 */
export const errorMiddleware: ErrorRequestHandler = async (e, req, res, next) => {
  let code = e.code || e.statusCode;
  if (e.code && typeof e.code === 'number' && e.code > 0) {
    console.warn('errorMiddleware', e.message, e.code);
  } else {
    console.error(e);
  }

  const executionId = req.header('function-execution-id');

  const message = 'message' in e ? e.message : e;

  code = code && code > 200 && code < 600 ? code : 500;
  res.status(code).json(e.entity ? {entity: e.entity, executionId} : {message, executionId});

  next();
};
