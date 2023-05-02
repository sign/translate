import {TranslocoTestingModule} from '@ngneat/transloco';
import {SITE_LANGUAGES} from './languages';

const availableLangs = SITE_LANGUAGES.map(l => l.key.toLocaleLowerCase());

const langs = {};
availableLangs.forEach(lang => (langs[lang] = require(`../../../../assets/i18n/${lang}.json`)));

export const AppTranslocoTestingModule = TranslocoTestingModule.forRoot({
  langs,
  translocoConfig: {
    availableLangs,
    defaultLang: 'en',
    reRenderOnLangChange: true,
  },
  preloadLangs: true,
});
