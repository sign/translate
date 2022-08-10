import {Injectable} from '@angular/core';
import {GoogleAnalyticsService} from '../../core/modules/google-analytics/google-analytics.service';
import {catchError, from, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AssetsService} from '../../core/services/assets/assets.service';
import {filter, map} from 'rxjs/operators';
import * as comlink from 'comlink';

type TranslationResponse = {text: string};

// TODO import types: import {ModelRegistry} from '@sign-mt/browsermt/build/src/worker.d.ts'
type ModelRegistry = any;
type TranslationOptions = any;

@Injectable({
  providedIn: 'root',
})
export class SignWritingTranslationService {
  worker: comlink.Remote<{
    importBergamotWorker: (jsFilePath: string, wasmFilePath: string) => Promise<void>;
    loadModel: (from: string, to: string, modelRegistry: ModelRegistry) => Promise<void>;
    translate: (
      from: string,
      to: string,
      sentences: string[],
      options: TranslationOptions[]
    ) => Promise<TranslationResponse[]>;
  }>;

  loadedModel: string;

  constructor(private ga: GoogleAnalyticsService, private http: HttpClient, private assets: AssetsService) {}

  async initWorker() {
    if (this.worker) {
      return;
    }
    const worker: Worker = new Worker('/node_modules/@sign-mt/browsermt/build/esm/worker.js');
    this.worker = comlink.wrap(worker);

    await this.worker.importBergamotWorker(
      'browsermt/bergamot-translator-worker.js',
      'browsermt/bergamot-translator-worker.wasm'
    );
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

  async loadOfflineModel(from: string, to: string) {
    const model = `${from}${to}`;
    if (this.loadedModel === model) {
      return;
    }

    const modelPath = `browsermt/${model}/`;
    const state = await this.assets.stat(modelPath);
    if (!state.exists) {
      throw new Error(`Model '${model}' not found locally`);
    }

    const modelRegistry = {[model]: await this.createModelRegistry(modelPath)};

    await this.initWorker();
    await this.worker.loadModel(from, to, modelRegistry);
    this.loadedModel = model;
  }

  async translateOffline(text: string, from: string, to: string): Promise<TranslationResponse> {
    await this.loadOfflineModel(from, to);
    const translations = await this.worker.translate(from, to, [text], {isHtml: false} as any);
    return translations[0];
  }

  translateOnline(
    text: string,
    from: string,
    to: string,
    direction: 'spoken-to-signed' | 'signed-to-spoken'
  ): Observable<TranslationResponse> {
    // TODO replace with model deployed on cloud functions
    const api = 'https://pub.cl.uzh.ch/demo/signwriting/spoken2sign';
    const body = {
      country_code: to,
      language_code: from,
      text,
      translation_type: 'sent',
    };
    return this.http.post<any>(api, body).pipe(map(res => ({text: res.translations[0]})));
    // const url = `https://spoken-to-signed-sxie2r74ua-uc.a.run.app/${direction}`; // TODO replace with deployed url
    // const query = new URLSearchParams({text, from, to});
    // return this.http.get<TranslationResponse>(`${url}?${query}`);
  }

  translateSpokenToSignWriting(
    text: string,
    spokenLanguage: string,
    signedLanguage: string
  ): Observable<TranslationResponse> {
    const offlineSpecific = () => {
      const newText = `<SW> ${text}`;
      return from(this.translateOffline(newText, spokenLanguage, signedLanguage));
    };

    const offlineGeneric = () => {
      const newText = `<SW> <${signedLanguage}> <${spokenLanguage}> ${text}`;
      return from(this.translateOffline(newText, 'spoken', 'signed'));
    };

    const online = () => this.translateOnline(text, spokenLanguage, signedLanguage, 'spoken-to-signed');

    return offlineSpecific().pipe(
      catchError(() => offlineGeneric()),
      filter(() => 'navigator' in globalThis && navigator.onLine),
      catchError(() => online())
    );
  }
}
