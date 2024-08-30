import {Component} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  pages: string[] = ['about', 'languages', 'contribute'];
  isMobile!: MediaQueryList;

  constructor(private mediaMatcher: MediaMatcher) {
    this.isMobile = this.mediaMatcher.matchMedia('(max-width: 768px)');
  }
}
