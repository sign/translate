import {Component} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SetSpokenLanguageText} from './modules/translate/translate.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  urlParams = new URLSearchParams(window.location.search);

  constructor(private transloco: TranslocoService, private store: Store) {
    this.listenLanguageChange();
    this.checkURLEmbedding();
    this.checkURLText();
  }

  listenLanguageChange(): void {
    this.transloco.langChanges$
      .pipe(
        tap(lang => {
          document.documentElement.lang = lang;
          document.dir = ['he', 'ar'].includes(lang) ? 'rtl' : 'ltr';

          // Set pre-rendered cloud function path with lang attribute
          const openSearch = Array.from(document.head.children).find(t => t.getAttribute('rel') === 'search');
          if (openSearch) {
            // not available in the test environment sometimes
            openSearch.setAttribute('href', `/opensearch.xml?lang=${lang}`);
          }
        })
      )
      .subscribe();

    const urlParam = this.urlParams.get('lang');
    const [navigatorParam] = navigator.language.split('-');
    this.transloco.setActiveLang(urlParam || navigatorParam);
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
}
