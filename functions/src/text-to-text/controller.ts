import * as express from 'express';
import * as functions from 'firebase-functions';
import * as httpErrors from 'http-errors';
import {errorMiddleware} from '../middlewares/error.middleware';
import {TextToTextTranslationModel} from './model/model';
import {Bucket, Storage} from '@google-cloud/storage';

const TRANSLATION_DIRECTIONS = new Set(['spoken-to-signed', 'signed-to-spoken']);

export class TextToTextTranslationEndpoint {
  models = new Map<string, TextToTextTranslationModel>();

  constructor(private bucket: Bucket) {}

  async modelFiles(direction: string, from: string, to: string): Promise<string[] | null> {
    const query = {prefix: `models/browsermt/${direction}/${from}-${to}`};
    const [files] = await this.bucket.getFiles(query);
    const paths = files.map(f => f.metadata.name).filter(p => !p.endsWith('/'));
    console.log(query, paths);
    return paths.length > 0 ? paths : null;
  }

  private async getModel(direction: string, from: string, to: string): Promise<TextToTextTranslationModel> {
    const modelName = `${from}-${to}`;
    if (!this.models.has(modelName)) {
      const files = await this.modelFiles(direction, from, to);
      let model: TextToTextTranslationModel;
      if (files) {
        model = new TextToTextTranslationModel(this.bucket, from, to);
        await model.init(files);
      } else {
        const [newFrom, newTo] = direction.split('-to-');
        if (newFrom === from && newTo === to) {
          throw new Error('No model or fallback model files found for direction');
        }
        model = await this.getModel(direction, newFrom, newTo);
      }

      this.models.set(modelName, model);
    }
    return this.models.get(modelName)!;
  }

  private parseParameters(req: express.Request) {
    const direction = req.params.direction as string;
    if (!TRANSLATION_DIRECTIONS.has(direction)) {
      throw new httpErrors.BadRequest('Invalid "direction" requested');
    }
    const from = req.query.from as string;
    const to = req.query.to as string;
    if (!from || !to) {
      throw new httpErrors.BadRequest('Missing "from" or "to" query parameters');
    }

    const text = req.query.text as string;
    if (!text) {
      throw new httpErrors.BadRequest('Missing "text" query parameter');
    }

    return {direction, from, to, text};
  }

  async request(req: express.Request, res: express.Response) {
    const {direction, from, to, text} = this.parseParameters(req);

    const model = await this.getModel(direction, from, to);
    const translatedText = await model.translate(text);

    res.set('Cache-Control', 'public, max-age=86400'); // one day
    res.json({
      direction,
      from,
      to,
      text: translatedText,
    });
  }
}

export const textToTextFunctions = (storage: Storage) => {
  const endpoint = new TextToTextTranslationEndpoint(storage.bucket('sign-mt-assets'));

  const app = express();
  app.get('/api/:direction', endpoint.request.bind(endpoint));
  app.use(errorMiddleware);
  return functions.https.onRequest(app);
};
