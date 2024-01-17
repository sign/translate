import {AfterViewInit, Component} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {filter, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SetSpokenLanguageText} from './modules/translate/translate.actions';
import {firstValueFrom} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {GoogleAnalyticsService} from './core/modules/google-analytics/google-analytics.service';
import {Capacitor} from '@capacitor/core';
import {languageCodeNormalizer} from './core/modules/transloco/languages';
import {Meta} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  urlParams = this.getUrlParams();

  constructor(
    private meta: Meta,
    private ga: GoogleAnalyticsService,
    private transloco: TranslocoService,
    private router: Router,
    private store: Store
  ) {
    this.listenLanguageChange();
    this.logRouterNavigation();
    this.checkURLEmbedding();
    this.checkURLText();
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

  getUrlParams() {
    if (!('window' in globalThis)) {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
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

  checkURLText(): void {
    const urlParam = this.urlParams.get('text');
    if (urlParam !== null) {
      this.store.dispatch(new SetSpokenLanguageText(urlParam));
    }
  }

  // setPageSizeClass() {
  //   // const html = document.documentElement;
  //   // const breakpoints = [
  //   //   {size: 'page-xs', query: 'screen and (max-width: 599px)'},
  //   //   {size: 'page-sm', query: 'screen and (min-width: 600px) and (max-width: 959px)'},
  //   //   {size: 'page-md', query: 'screen and (min-width: 960px) and (max-width: 1279px)'},
  //   //   {size: 'page-lg', query: 'screen and (min-width: 1280px) and (max-width: 1919px)'},
  //   //   {size: 'page-xl', query: 'screen and (min-width: 1920px)'},
  //   // ];
  //   //
  //   // for (const breakpoint of breakpoints) {
  //   //   const match = window.matchMedia(breakpoint.query);
  //   //   const listener = ({matches}) => {
  //   //     if (matches) {
  //   //       html.classList.add(breakpoint.size);
  //   //     } else {
  //   //       html.classList.remove(breakpoint.size);
  //   //     }
  //   //   };
  //   //   match.addEventListener('change', listener);
  //   //   listener(match);
  //   // }
  // }
  //
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
