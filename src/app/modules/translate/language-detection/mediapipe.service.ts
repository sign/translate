import {Injectable} from '@angular/core';
import {GoogleAnalyticsService} from '../../../core/modules/google-analytics/google-analytics.service';
import {TranslationService} from '../translate.service';
import {LanguageDetectionService} from './language-detection.service';
import type {LanguageDetector} from '@mediapipe/tasks-text';

@Injectable({
  providedIn: 'root',
})
export class MediaPipeLanguageDetectionService extends LanguageDetectionService {
  private detector: LanguageDetector;

  constructor(private ga: GoogleAnalyticsService, translationService: TranslationService) {
    super(translationService);
  }

  async init(): Promise<void> {
    if (this.detector) {
      return;
    }

    const textTasks = await this.ga.trace(
      'language-detector',
      'import',
      () => import(/* webpackChunkName: "@mediapipe/tasks-text" */ '@mediapipe/tasks-text')
    );

    this.detector = await this.ga.trace('language-detector', 'create', async () => {
      const basePath = 'assets/models/mediapipe-language-detector';
      const wasmFiles = await textTasks.FilesetResolver.forTextTasks(basePath);
      return await textTasks.LanguageDetector.createFromModelPath(wasmFiles, `${basePath}/model.tflite`);
    });
  }

  async detectSpokenLanguage(text: string): Promise<string> {
    if (!this.detector) {
      return this.languageCode(null);
    }

    const {languages} = await this.ga.trace('language-detector', 'detect', () => this.detector.detect(text));

    if (languages.length === 0) {
      // This usually happens when the text is too short.
      return this.languageCode(null);
    }

    return this.languageCode(languages[0].languageCode);
  }
}
