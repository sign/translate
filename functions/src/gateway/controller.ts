import * as express from 'express';
import {Application} from 'express';

import * as cors from 'cors';
import {errorMiddleware} from '../middlewares/error.middleware';
import {onRequest} from 'firebase-functions/v2/https';
import {unkeyAuth} from '../middlewares/unkey-auth.middleware';
import {HttpsOptions} from 'firebase-functions/lib/v2/providers/https';
import {avatars} from './avatars';
import {me} from './me';
import {spokenToSigned} from './spoken-to-signed';
import {optionsRequest} from '../middlewares/options.request';
import {createAppCheckKey} from '../middlewares/create-appcheck.middleware';

// API Documentation: https://app.swaggerhub.com/apis/AmitMoryossef/sign_mt/
const app: Application = express();
app.use(cors());
app.use(unkeyAuth);
app.use(createAppCheckKey);
app.options('*', optionsRequest);

spokenToSigned(app);
me(app);
avatars(app);

app.use(errorMiddleware);

const reqOpts: HttpsOptions = {
  invoker: 'public',
  concurrency: 100,
  timeoutSeconds: 60,
};
export const gatewayFunction = onRequest(reqOpts, app);
