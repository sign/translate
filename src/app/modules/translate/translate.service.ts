import {Injectable} from '@angular/core';
import {LanguageIdentifier} from 'cld3-asm';
import {GoogleAnalyticsService} from '../../core/modules/google-analytics/google-analytics.service';
import {firstValueFrom, Observable} from 'rxjs';
import {TranslationResponse} from '@sign-mt/browsermt';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppCheck} from '../../core/helpers/app-check/app-check';

const OBSOLETE_LANGUAGE_CODES = {
  iw: 'he',
};
const DEFAULT_SPOKEN_LANGUAGE = 'en';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private cld: LanguageIdentifier;

  signedLanguages = [
    'ase',
    'gsg',
    'fsl',
    'bfi',
    'ils',
    'sgg',
    'ssr',
    'slf',
    'ssp',
    'jos',
    'rsl-by',
    'bqn',
    'csl',
    'csq',
    'cse',
    'dsl',
    'ins',
    'nzs',
    'eso',
    'fse',
    'asq',
    'gss-cy',
    'gss',
    'icl',
    'ise',
    'jsl',
    'lsl',
    'lls',
    'psc',
    'pso',
    'bzs',
    'psr',
    'rms',
    'rsl',
    'svk',
    'aed',
    'csg',
    'csf',
    'mfs',
    'swl',
    'tsm',
    'ukl',
    'pks',
  ];

  spokenLanguages = [
    'en',
    'de',
    'fr',
    'af',
    'sq',
    'am',
    'ar',
    'hy',
    'az',
    'eu',
    'be',
    'bn',
    'bs',
    'bg',
    'ca',
    'ceb',
    'ny',
    'zh',
    'co',
    'hr',
    'cs',
    'da',
    'nl',
    'eo',
    'et',
    'tl',
    'fi',
    'fy',
    'gl',
    'ka',
    'es',
    'el',
    'gu',
    'ht',
    'ha',
    'haw',
    'he',
    'hi',
    'hmn',
    'hu',
    'is',
    'ig',
    'id',
    'ga',
    'it',
    'ja',
    'jv',
    'kn',
    'kk',
    'km',
    'rw',
    'ko',
    'ku',
    'ky',
    'lo',
    'la',
    'lv',
    'lt',
    'lb',
    'mk',
    'mg',
    'ms',
    'ml',
    'mt',
    'mi',
    'mr',
    'mn',
    'my',
    'ne',
    'no',
    'or',
    'ps',
    'fa',
    'pl',
    'pt',
    'pa',
    'ro',
    'ru',
    'sm',
    'gd',
    'sr',
    'st',
    'sn',
    'sd',
    'si',
    'sk',
    'sl',
    'so',
    'su',
    'sw',
    'sv',
    'tg',
    'ta',
    'tt',
    'te',
    'th',
    'tr',
    'tk',
    'uk',
    'ur',
    'ug',
    'uz',
    'vi',
    'cy',
    'xh',
    'yi',
    'yo',
    'zu',
  ];

  constructor(private ga: GoogleAnalyticsService, private http: HttpClient) {}

  async initCld(): Promise<void> {
    if (this.cld) {
      return;
    }
    const cld3 = await this.ga.trace('cld', 'import', () => import(/* webpackChunkName: "cld3-asm" */ 'cld3-asm'));
    const cldFactory = await this.ga.trace('cld', 'load', () => cld3.loadModule());
    this.cld = await this.ga.trace('cld', 'create', () => cldFactory.create(1, 500));
  }

  async detectSpokenLanguage(text: string): Promise<string> {
    if (!this.cld) {
      return DEFAULT_SPOKEN_LANGUAGE;
    }

    const language = await this.ga.trace('cld', 'find', () => this.cld.findLanguage(text));
    const languageCode = language.is_reliable ? language.language : DEFAULT_SPOKEN_LANGUAGE;
    const correctedCode = OBSOLETE_LANGUAGE_CODES[languageCode] ?? languageCode;
    return this.spokenLanguages.includes(correctedCode) ? correctedCode : DEFAULT_SPOKEN_LANGUAGE;
  }

  async normalizeSpokenLanguageText(language: string, text: string): Promise<string> {
    const params = new URLSearchParams();
    params.set('lang', language);
    params.set('text', text);
    const url = 'https://sign.mt/api/text-normalization?' + params.toString();

    const appCheckToken = await AppCheck.getToken();
    const headers = {'X-AppCheck-Token': appCheckToken};

    const response = await firstValueFrom(this.http.get<{text: string}>(url, {headers}));
    return response.text;
  }

  translateSpokenToSigned(text: string, spokenLanguage: string, signedLanguage: string): string {
    const api = 'https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose';
    return `${api}?text=${encodeURIComponent(text)}&spoken=${spokenLanguage}&signed=${signedLanguage}`;
  }
}
