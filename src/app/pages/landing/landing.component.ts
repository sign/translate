import {Component, inject} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  private mediaMatcher = inject(MediaMatcher);

  pages: string[] = ['about', 'contribute'];
  isMobile!: MediaQueryList;

  constructor() {
    this.isMobile = this.mediaMatcher.matchMedia('(max-width: 768px)');
  }
}
