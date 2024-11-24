import {Component, inject} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  pages: string[] = ['about', 'contribute'];
  isMobile!: MediaQueryList;

  constructor(private mediaMatcher: MediaMatcher) {
    this.isMobile = this.mediaMatcher.matchMedia('(max-width: 768px)');
  }

  // TODO: remove this when i18n is supported
  private transloco = inject(TranslocoService);
  lastActiveLang = this.transloco.getActiveLang();

  ionViewWillEnter() {
    this.transloco.setActiveLang('en');
  }

  ionViewWillLeave() {
    this.transloco.setActiveLang(this.lastActiveLang);
  }
}
