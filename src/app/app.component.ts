import {AfterViewInit, Component, inject} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';
import {filter, tap} from 'rxjs/operators';
import {firstValueFrom} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {GoogleAnalyticsService} from './core/modules/google-analytics/google-analytics.service';
import {languageCodeNormalizer} from './core/modules/transloco/languages';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import {getUrlParams} from './core/helpers/url';
import {APPLE_APP_STORE_ID} from './core/constants';
import * as CookieConsent from 'vanilla-cookieconsent';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements AfterViewInit {
  private ga = inject(GoogleAnalyticsService);
  private transloco = inject(TranslocoService);
  private router = inject(Router);
  private mediaMatcher = inject(MediaMatcher);

  urlParams = getUrlParams();

  constructor() {
    this.listenLanguageChange();
    this.logRouterNavigation();
    this.checkURLEmbedding();
    this.updateToolbarColor();
    this.setSmartAppBanner();
  }

  async ngAfterViewInit() {
    this.initCookieConsent();
  }

  updateToolbarColor() {
    if (!('window' in globalThis)) {
      return;
    }

    const matcher = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)');

    function onColorSchemeChange(): any {
      const toolbar = document.querySelector('ion-toolbar');
      if (!toolbar) {
        // Try again if the toolbar is not yet available
        return requestAnimationFrame(onColorSchemeChange);
      }

      const toolbarColor = window.getComputedStyle(toolbar).getPropertyValue('--background');
      if (!toolbarColor) {
        // Try again if the color is not yet available
        return requestAnimationFrame(onColorSchemeChange);
      }

      // Update the theme-color meta tag with the toolbar color
      const mode = matcher.matches ? 'dark' : 'light';
      const selector = `meta[name="theme-color"][media="(prefers-color-scheme: ${mode})"]`;
      const themeColor = document.head.querySelector(selector);
      themeColor.setAttribute('content', toolbarColor);
    }

    matcher.addEventListener('change', onColorSchemeChange);
    onColorSchemeChange();
  }

  initCookieConsent() {
    if (!('document' in globalThis)) {
      return Promise.resolve();
    }
    return CookieConsent.run({
      root: 'body',
      autoShow: true,
      hideFromBots: true,

      cookie: {
        name: 'cc_cookie',
        domain: location.hostname,
        path: '/',
        sameSite: 'Lax',
        expiresAfterDays: 182,
      },

      // https://cookieconsent.orestbida.com/reference/configuration-reference.html#guioptions
      guiOptions: {
        consentModal: {
          layout: 'cloud inline',
          position: 'bottom center',
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      onConsent: ({cookie}) => {
        if (typeof gtag === 'undefined') {
          return;
        }

        const granted = 'granted' as const;
        const denied = 'denied' as const;

        const functionality = cookie.categories.includes('functionality');
        const analyticsConsent = cookie.categories.includes('analytics');
        const marketing = cookie.categories.includes('marketing');

        gtag('consent', 'update', {
          functionality_storage: functionality ? granted : denied,
          personalization_storage: functionality ? granted : denied,
          analytics_storage: analyticsConsent ? granted : denied,
          ad_storage: marketing ? granted : denied,
          ad_personalization: marketing ? granted : denied,
          ad_user_data: marketing ? granted : denied,
        });
      },
      categories: {
        necessary: {
          enabled: true, // this category is enabled by default
          readOnly: true, // this category cannot be disabled
        },
        functionality: {
          enabled: true,
        },
        analytics: {
          autoClear: {
            cookies: [
              {
                name: /^_ga/, // regex: match all cookies starting with '_ga'
              },
              {
                name: '_gid', // string: exact cookie name
              },
            ],
          },
          // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
          services: {
            ga: {
              label: 'Google Analytics',
            },
          },
        },
        marketing: {},
      },

      language: {
        default: 'en',
        translations: {
          en: 'assets/i18n/cookies/en.json',
        },
      },
    });
  }

  logRouterNavigation() {
    const isLanguageLoaded = firstValueFrom(
      this.transloco.events$.pipe(filter(e => e.type === 'translationLoadSuccess'))
    );

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(async (event: NavigationEnd) => {
          await isLanguageLoaded; // Before triggering page view, wait for language to be loaded
          await this.ga.setCurrentScreen(event.urlAfterRedirects);
        })
      )
      .subscribe();
  }

  listenLanguageChange() {
    const urlParam = this.urlParams.get('lang');

    if (!('navigator' in globalThis) || !('document' in globalThis)) {
      if (urlParam) {
        this.transloco.setActiveLang(urlParam);
      }
      return;
    }

    this.transloco.langChanges$
      .pipe(
        tap(lang => {
          document.documentElement.lang = lang;
          document.dir = ['he', 'ar', 'fa', 'ku', 'ps', 'sd', 'ug', 'ur', 'yi'].includes(lang) ? 'rtl' : 'ltr';
        })
      )
      .subscribe();

    this.transloco.setActiveLang(urlParam || languageCodeNormalizer(navigator.language));
  }

  setSmartAppBanner(): void {
    if (!('document' in globalThis)) {
      return;
    }
    const meta = document.createElement('meta');
    meta.name = 'apple-itunes-app';
    meta.content = `app-id=${APPLE_APP_STORE_ID}`;
    document.head.appendChild(meta);
  }

  checkURLEmbedding(): void {
    const urlParam = this.urlParams.get('embed');
    if (urlParam !== null) {
      document.body.classList.add('embed');
    }
  }
}
