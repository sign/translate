import {Component, inject, OnInit} from '@angular/core';
import {TranslocoDirective, TranslocoService} from '@jsverse/transloco';
import {BaseComponent} from '../../../../components/base/base.component';
import {takeUntil, tap} from 'rxjs/operators';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {chevronBack, chevronForward} from 'ionicons/icons';

@Component({
  selector: 'app-about-direction',
  templateUrl: './about-direction.component.html',
  styleUrls: ['./about-direction.component.scss'],
  imports: [IonIcon, TranslocoDirective],
})
export class AboutDirectionComponent extends BaseComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private domSanitizer = inject(DomSanitizer);

  iOSScreenshot: SafeUrl;
  androidScreenshot: SafeUrl;

  constructor() {
    super();

    addIcons({chevronBack, chevronForward});
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
