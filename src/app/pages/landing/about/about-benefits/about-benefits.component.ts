import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, viewChild} from '@angular/core';
import type {Swiper} from 'swiper/types';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {TranslocoDirective, TranslocoService} from '@jsverse/transloco';
import {takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../../components/base/base.component';
import {IonCard, IonCardContent, IonCardTitle, IonIcon} from '@ionic/angular/standalone';
import {LazyMapComponent} from '../lazy-map/lazy-map.component';
import {addIcons} from 'ionicons';
import {bookOutline, cloudOfflineOutline, languageOutline, optionsOutline, swapHorizontalOutline} from 'ionicons/icons';
import {NtkmeButtonModule} from '@ctrl/ngx-github-buttons';

@Component({
  selector: 'app-about-benefits',
  templateUrl: './about-benefits.component.html',
  styleUrls: ['./about-benefits.component.scss'],
  imports: [IonCard, IonCardContent, TranslocoDirective, IonCardTitle, LazyMapComponent, IonIcon, NtkmeButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AboutBenefitsComponent extends BaseComponent implements AfterViewInit, OnInit {
  static isSwiperDefined = false;

  private transloco = inject(TranslocoService);
  private domSanitizer = inject(DomSanitizer);

  readonly swiper = viewChild<ElementRef<{swiper: Swiper}>>('swiper');

  iOSScreenshot: SafeUrl;

  activeSlide = 0;

  slides = [
    {id: 'real-time', icon: 'swap-horizontal-outline'},
    {id: 'multilingual', icon: 'language-outline'},
    {id: 'appearance', icon: 'options-outline'},
    {id: 'open-source', icon: 'book-outline'},
    {id: 'offline', icon: 'cloud-offline-outline'},
  ];

  constructor() {
    super();
    addIcons({swapHorizontalOutline, languageOutline, optionsOutline, bookOutline, cloudOfflineOutline});

    // Define the swiper custom element
    if (!AboutBenefitsComponent.isSwiperDefined) {
      import(/* webpackChunkName: "swiper" */ 'swiper/element/bundle').then(({register}) => register());
      AboutBenefitsComponent.isSwiperDefined = true;
    }
  }

  async ngOnInit() {
    this.transloco.langChanges$
      .pipe(
        tap(lang => {
          const framePath = `assets/promotional/about/iphone/${lang}_framed.webp`;
          this.iOSScreenshot = this.domSanitizer.bypassSecurityTrustResourceUrl(framePath);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  // Function to navigate to the specific slide
  slideTo(slideIndex: number) {
    this.swiper().nativeElement.swiper.slideTo(slideIndex);
  }

  ngAfterViewInit() {
    const swiperEl = this.swiper().nativeElement;
    if ('document' in globalThis) {
      if (swiperEl.swiper) {
        swiperEl.swiper.on('activeIndexChange', () => {
          this.activeSlide = swiperEl.swiper.activeIndex;
        });
      } else {
        setTimeout(() => this.ngAfterViewInit(), 10);
      }
    }
  }
}
