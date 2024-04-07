import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
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

  constructor(private http: HttpClient) {}

  private lastSpokenLanguageSegmenter: {language: string; segmenter: Intl.Segmenter};

  splitSpokenSentences(language: string, text: string): string[] {
    // If the browser does not support the Segmenter API (FireFox<127), return the whole text as a single segment
    if (!('Segmenter' in Intl)) {
      return [text];
    }

    // Construct a segmenter for the given language, can take 1ms~
    if (this.lastSpokenLanguageSegmenter?.language !== language) {
      this.lastSpokenLanguageSegmenter = {
        language,
        segmenter: new Intl.Segmenter(language, {granularity: 'sentence'}),
      };
    }
    const segments = this.lastSpokenLanguageSegmenter.segmenter.segment(text);
    return Array.from(segments).map(segment => segment.segment);
  }

  normalizeSpokenLanguageText(language: string, text: string): Observable<string> {
    const params = new URLSearchParams();
    params.set('lang', language);
    params.set('text', text);
    const url = 'https://sign.mt/api/text-normalization?' + params.toString();

    return this.http.get<{text: string}>(url).pipe(map(response => response.text));
  }

  describeSignWriting(fsw: string): Observable<string> {
    const url = 'https://sign.mt/api/signwriting-description';

    return this.http
      .post<{result: {description: string}}>(url, {data: {fsw}})
      .pipe(map(response => response.result.description));
  }

  translateSpokenToSigned(text: string, spokenLanguage: string, signedLanguage: string): string {
    const api = 'https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose';
    return `${api}?text=${encodeURIComponent(text)}&spoken=${spokenLanguage}&signed=${signedLanguage}`;
  }
}
