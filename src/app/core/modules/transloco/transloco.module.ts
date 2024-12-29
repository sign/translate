import {provideTransloco} from '@jsverse/transloco';
import {HttpLoader, translocoScopes} from './transloco.loader';
import {SITE_LANGUAGES} from './languages';

export const AppTranslocoProviders = [
  provideTransloco({
    config: {
      availableLangs: SITE_LANGUAGES.map(l => l.key),
      defaultLang: 'en',
      fallbackLang: 'en',
      reRenderOnLangChange: true,
      prodMode: true, // TODO !isDevMode(),
      missingHandler: {
        // It will use the first language set in the `fallbackLang` property
        useFallbackTranslation: true,
      },
    },
    loader: HttpLoader,
  }),
  translocoScopes,
];
