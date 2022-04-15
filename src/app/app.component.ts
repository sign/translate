import {Component} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private transloco: TranslocoService) {
    this.listenLanguageChange();
  }

  listenLanguageChange(): void {
    this.transloco.langChanges$.pipe(
      tap((lang) => {
        document.documentElement.lang = lang;
        document.dir = ['he', 'ar'].includes(lang) ? 'rtl' : 'ltr';

        // Set pre-rendered cloud function path with lang attribute
        const openSearch = Array.from(document.head.children).find(t => t.getAttribute('rel') === 'search');
        openSearch.setAttribute('href', `/opensearch.xml?lang=${lang}`);
      })
    ).subscribe();

    const urlParams = new URLSearchParams(window.location.search);
    const urlParam = urlParams.get('lang');
    const [navigatorParam] = navigator.language.split('-');
    this.transloco.setActiveLang(urlParam || navigatorParam);
  }
}
