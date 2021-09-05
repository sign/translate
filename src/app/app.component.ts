import {Component} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private transloco: TranslocoService) {
    this.listenLanguageChange();
  }

  listenLanguageChange(): void {
    this.transloco.langChanges$.pipe(
      tap((lang) => {
        document.documentElement.lang = lang;
        document.dir = lang === 'he' ? 'rtl' : 'ltr';
      })
    ).subscribe();

    const urlParams = new URLSearchParams(window.location.search);
    const urlParam = urlParams.get('lang');
    const [navigatorParam] = navigator.language.split('-');
    this.transloco.setActiveLang(urlParam || navigatorParam);
  }
}
