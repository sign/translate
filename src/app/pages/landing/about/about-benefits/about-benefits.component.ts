import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Swiper} from 'swiper/types';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {TranslocoService} from '@ngneat/transloco';
import {takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../../components/base/base.component';

@Component({
  selector: 'app-about-benefits',
  templateUrl: './about-benefits.component.html',
  styleUrls: ['./about-benefits.component.scss'],
})
export class AboutBenefitsComponent extends BaseComponent implements AfterViewInit, OnInit {
  @ViewChild('swiper', {static: false}) swiper: ElementRef<{swiper: Swiper}>;
  activeSlide = 0;

  slides = [
    {id: 'real-time', icon: 'swap-horizontal-outline'},
    {id: 'multilingual', icon: 'language-outline'},
    {id: 'appearance', icon: 'options-outline'},
    {id: 'open-source', icon: 'book-outline'},
    {id: 'offline', icon: 'cloud-offline-outline'},
  ];

  iOSScreenshot: SafeUrl;

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
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  // Function to navigate to the specific slide
  slideTo(slideIndex: number) {
    this.swiper.nativeElement.swiper.slideTo(slideIndex);
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.on('activeIndexChange', () => {
      this.activeSlide = this.swiper.nativeElement.swiper.activeIndex;
    });
  }
}
