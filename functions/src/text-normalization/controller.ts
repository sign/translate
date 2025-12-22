import * as express from 'express';
import * as cors from 'cors';
import * as httpErrors from 'http-errors';
import * as crypto from 'crypto';
import {errorMiddleware} from '../middlewares/error.middleware';
import {FirebaseDatabase, Reference} from '@firebase/database-types';
import {TextNormalizationModel} from './model';
import {onRequest} from 'firebase-functions/v2/https';
import {defineString, StringParam} from 'firebase-functions/params';
import {appCheckVerification} from '../middlewares/appcheck.middleware';
import {optionsRequest} from '../middlewares/options.request';
import {unkeyRatelimit} from '../middlewares/unkey-ratelimit.middleware';

export class TextNormalizationEndpoint {
  constructor(
    private database: FirebaseDatabase,
    private OpenAIApiKey: StringParam
  ) {}

  private parseParameters(req: express.Request) {
    const lang = req.query.lang as string;
    if (!lang) {
      throw new httpErrors.BadRequest('Missing "lang" query parameter');
    }

    const text = req.query.text as string;
    if (!text) {
      throw new httpErrors.BadRequest('Missing "text" query parameter');
    }

    return {lang, text};
  }

  getDBRef(lang: string, text: string): Reference {
    const hash = crypto.createHash('md5').update(text).digest('hex');
    return this.database.ref('normalizations').child(lang).child(hash);
  }

  async getCached(lang: string, text: string): Promise<string | Reference> {
    const ref = this.getDBRef(lang, text);

    return new Promise(async resolve => {
      let result = ref;
      await ref.transaction(cache => {
        if (!cache) {
          return null;
        }

        console.log('Cache hit', cache);
        result = cache.output;
        return {
          ...cache,
          counter: cache.counter + 1,
          timestamp: Date.now(),
        };
      });
      resolve(result);
    });
  }

  async normalize(lang: string, text: string): Promise<string | null> {
    const model = new TextNormalizationModel(this.OpenAIApiKey.value());
    return model.normalize(lang, text);
  }

  async request(req: express.Request, res: express.Response) {
    res.set('Cache-Control', 'public, max-age=86400, s-maxage=0');

    const {lang, text} = this.parseParameters(req);
    console.log('Requesting', {lang, text});

    const cache = await this.getCached(lang, text);
    let output: string | null;
    if (typeof cache === 'string') {
      output = cache;
    } else {
      output = await this.normalize(lang, text);
      // Set cache for the input-output mapping
      await cache.set({
        input: text,
        output,
        counter: 1,
        timestamp: Date.now(),
      });
      // Set cache for the output as well, to map to itself
      if (output) {
        await this.getDBRef(lang, output).set({
          input: output,
          output,
          counter: 0,
          timestamp: Date.now(),
        });
      }
    }

    const response = {
      lang,
      text: output,
    };
    res.json(response);
    console.log('Response', response);
  }
}

export const textNormalizationFunctions = (database: FirebaseDatabase) => {
  const openAIKey = defineString('OPENAI_API_KEY');
  const endpoint = new TextNormalizationEndpoint(database, openAIKey);
  const request = endpoint.request.bind(endpoint);

  const app = express();
  app.use(cors());
  app.use(appCheckVerification);
  app.use(unkeyRatelimit('api.text-normalization', 250, '30m'));
  app.options('*', optionsRequest);
  app.get(['/', '/api/text-normalization'], request);
  app.use(errorMiddleware);

  return onRequest(
    {
      invoker: 'public',
      cpu: 'gcf_gen1',
      concurrency: 1,
      timeoutSeconds: 30,
    },
    app
  );
};
