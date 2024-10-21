import {Application, Request, Response} from 'express';
import {paths} from './utils';
import {createProxyMiddleware} from 'http-proxy-middleware';
import * as http from 'http';

export function spokenToSigned(app: Application) {
  app.use(
    paths('spoken-text-to-signed-pose'),
    createProxyMiddleware({
      target: 'https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose',
      changeOrigin: true,
    })
  );

  app.use(
    paths('spoken-text-to-signed-video'),
    createProxyMiddleware({
      target: 'https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_video',
      changeOrigin: true,
      selfHandleResponse: true,
      on: {
        proxyRes: (proxyRes: http.IncomingMessage, req: Request, res: Response) => {
          proxyRes.pipe(res);
        },
      },
    })
  );
}
