import {Component, OnInit} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {BaseComponent} from '../../../../components/base/base.component';
import {takeUntil, tap} from 'rxjs/operators';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-about-direction',
  templateUrl: './about-direction.component.html',
  styleUrls: ['./about-direction.component.scss'],
})
export class AboutDirectionComponent extends BaseComponent implements OnInit {
  iOSScreenshot: SafeUrl;
  androidScreenshot: SafeUrl;

  constructor(private transloco: TranslocoService, private domSanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.transloco.langChanges$
      .pipe(
        tap(lang => {
          this.iOSScreenshot = this.domSanitizer.bypassSecurityTrustResourceUrl(
            `assets/promotional/about/iphone/${lang}_framed.webp`
          );
          this.androidScreenshot = this.domSanitizer.bypassSecurityTrustResourceUrl(
            `assets/promotional/about/android/${lang}_framed.webp`
          );
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
