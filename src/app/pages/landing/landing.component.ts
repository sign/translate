import {Component, inject} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {arrowForward} from 'ionicons/icons';
import {addIcons} from 'ionicons';
import {LandingFooterComponent} from './landing-footer/landing-footer.component';
import {LogoComponent} from '../../components/logo/logo.component';
import {AnnouncementBannerComponent} from '../../components/announcement-banner/announcement-banner.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonMenuToggle,
    IonItem,
    RouterLink,
    IonFooter,
    IonButton,
    TranslocoPipe,
    IonButtons,
    IonMenuButton,
    IonIcon,
    RouterOutlet,
    LandingFooterComponent,
    LogoComponent,
    AnnouncementBannerComponent,
  ],
})
export class LandingComponent {
  private mediaMatcher = inject(MediaMatcher);
  isMobile = this.mediaMatcher.matchMedia('(max-width: 768px)');

  pages = [
    {key: 'home', route: '/'},
    {key: 'about', route: '/about'},
    {key: 'contribute', route: '/about/contribute'},
  ];

  constructor() {
    addIcons({arrowForward});
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
