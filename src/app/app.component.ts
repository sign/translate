import {AfterViewInit, Component, inject} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {filter, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {firstValueFrom} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {GoogleAnalyticsService} from './core/modules/google-analytics/google-analytics.service';
import {Capacitor} from '@capacitor/core';
import {languageCodeNormalizer} from './core/modules/transloco/languages';
import {Meta} from '@angular/platform-browser';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import {getUrlParams} from './core/helpers/url';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements AfterViewInit {
  private meta = inject(Meta);
  private ga = inject(GoogleAnalyticsService);
  private transloco = inject(TranslocoService);
  private router = inject(Router);
  private store = inject(Store);

  urlParams = getUrlParams();

  constructor() {
    this.listenLanguageChange();
    this.logRouterNavigation();
    this.checkURLEmbedding();
    this.setPageKeyboardClass();
  }

  async ngAfterViewInit() {
    if (Capacitor.isNativePlatform()) {
      this.meta.updateTag({
        name: 'viewport',
        content:
          'minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, initial-scale=1.0, viewport-fit=cover, width=device-width',
      });

      const {SplashScreen} = await import(
        /* webpackChunkName: "@capacitor/splash-screen" */ '@capacitor/splash-screen'
      );
      await SplashScreen.hide();
    }
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

          // Set pre-rendered cloud function path with lang attribute
          const openSearch = Array.from(document.head.children).find(t => t.getAttribute('rel') === 'search');
          if (openSearch) {
            // not available in the test environment sometimes
            openSearch.setAttribute('href', `/opensearch.xml?lang=${lang}`);
          }
        })
      )
      .subscribe();

    this.transloco.setActiveLang(urlParam || languageCodeNormalizer(navigator.language));
  }

  checkURLEmbedding(): void {
    const urlParam = this.urlParams.get('embed');
    if (urlParam !== null) {
      document.body.classList.add('embed');
    }
  }

  async setPageKeyboardClass() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    const {Keyboard} = await import(/* webpackChunkName: "@capacitor/keyboard" */ '@capacitor/keyboard');
    const html = document.documentElement;
    const className = 'keyboard-is-open';
    Keyboard.addListener('keyboardWillShow', () => html.classList.add(className));
    Keyboard.addListener('keyboardWillHide', () => html.classList.remove(className));
  }
}
