import {Injectable} from '@angular/core';
import {catchError, from, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AssetsService} from '../../core/services/assets/assets.service';
import {filter, map} from 'rxjs/operators';
import {ComlinkWorkerInterface, ModelRegistry, TranslationResponse} from '@sign-mt/browsermt';

type TranslationDirection = 'spoken-to-signed' | 'signed-to-spoken';

@Injectable({
  providedIn: 'root',
})
export class SignWritingTranslationService {
  worker: ComlinkWorkerInterface;

  loadedModel: string;

  constructor(private http: HttpClient, private assets: AssetsService) {}

  async initWorker() {
    if (this.worker) {
      return;
    }
    const {createBergamotWorker} = await import(/* webpackChunkName: "@sign-mt/browsermt" */ '@sign-mt/browsermt');
    this.worker = createBergamotWorker('/browsermt/worker.js');

    await this.worker.importBergamotWorker('bergamot-translator-worker.js', 'bergamot-translator-worker.wasm');
  }

  async createModelRegistry(modelPath: string) {
    const modelRegistry = {};
    const modelFiles = await this.assets.getDirectory(modelPath);
    for (const [name, path] of modelFiles.entries()) {
      const fileType = name.split('.').shift();
      modelRegistry[fileType] = {name: path, size: 0, estimatedCompressedSize: 0, modelType: 'prod'};
    }
    return modelRegistry;
  }

  async loadOfflineModel(direction: TranslationDirection, from: string, to: string) {
    const modelName = `${from}${to}`;
    if (this.loadedModel === modelName) {
      return;
    }

    const modelPath = `models/browsermt/${direction}/${from}-${to}/`;
    const state = this.assets.stat(modelPath);
    if (!state.exists) {
      throw new Error(`Model '${modelPath}' not found locally`);
    }

    const modelRegistry = {[modelName]: await this.createModelRegistry(modelPath)} as ModelRegistry;

    await this.initWorker();
    await this.worker.loadModel(from, to, modelRegistry);
    this.loadedModel = modelName;
  }

  async translateOffline(
    direction: TranslationDirection,
    text: string,
    from: string,
    to: string
  ): Promise<TranslationResponse> {
    await this.loadOfflineModel(direction, from, to);

    let translations = await this.worker.translate(from, to, [text], [{isHtml: false}]);
    if (typeof translations[0] === 'string') {
      translations = translations.map((t: any) => ({text: t}));
    }

    translations = translations.map(({text}) => ({text: this.postProcessSignWriting(text)}));

    return translations[0];
  }

  translateOnline(
    direction: TranslationDirection,
    text: string,
    sentences: string[],
    from: string,
    to: string
  ): Observable<TranslationResponse> {
    // TODO use the new API (when bergamot model is trained)
    // const query = new URLSearchParams({from, to, text});
    // return this.http.get<TranslationResponse>(`https://sign.mt/api/${direction}?${query}`);'

    const url = 'https://sign.mt/api/spoken-text-to-signwriting';
    const body = {
      data: {
        texts: sentences.map(s => s.trim()),
        spoken_language: from,
        signed_language: to,
      },
    };

    interface SpokenToSignWritingResponse {
      result: {
        input: string[];
        output: string[];
      };
    }

    return this.http
      .post<SpokenToSignWritingResponse>(url, body)
      .pipe(map(res => ({text: res.result.output.join(' ')})));
  }

  translateSpokenToSignWriting(
    text: string,
    sentences: string[],
    spokenLanguage: string,
    signedLanguage: string
  ): Observable<TranslationResponse> {
    const direction: TranslationDirection = 'spoken-to-signed';
    const offlineSpecific = () => {
      const newText = `${this.preProcessSpokenText(text)}`;
      return from(this.translateOffline(direction, newText, spokenLanguage, signedLanguage));
    };

    const offlineGeneric = () => {
      const newText = `$${spokenLanguage} $${signedLanguage} ${this.preProcessSpokenText(text)}`;
      return from(this.translateOffline(direction, newText, 'spoken', 'signed'));
    };

    const online = () => this.translateOnline(direction, text, sentences, spokenLanguage, signedLanguage);

    return offlineSpecific().pipe(
      catchError(offlineGeneric),
      filter(() => !('navigator' in globalThis) || navigator.onLine),
      catchError(online)
    );
  }

  preProcessSpokenText(text: string) {
    return text.replace('\n', ' ');
  }

  postProcessSignWriting(text: string) {
    // remove all tokens that start with a $
    text = text.replace(/\$[^\s]+/g, '');

    // space signs correctly
    text = text.replace(/ /g, '');
    text = text.replace(/(\d)M/g, '$1 M');

    return text;
  }
}
