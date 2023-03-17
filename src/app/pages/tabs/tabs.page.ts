import {Component} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPageComponent {
  isMobile = this.mediaMatcher.matchMedia('(max-width: 599px)');

  constructor(private mediaMatcher: MediaMatcher) {}
}
