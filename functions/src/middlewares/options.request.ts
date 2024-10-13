import * as express from 'express';

export function optionsRequest(req: express.Request, res: express.Response) {
  res.status(200).end();
}
