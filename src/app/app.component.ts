import {Component} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private transloco: TranslocoService) {
    const language = transloco.getActiveLang();
    if (language === 'he') {
      document.dir = 'rtl';
    }
  }
}
