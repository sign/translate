import {Component} from '@angular/core';
import {AboutHeroComponent} from './about-hero/about-hero.component';
import {AboutBenefitsComponent} from './about-benefits/about-benefits.component';
import {AboutCustomersComponent} from './about-customers/about-customers.component';
import {AboutFaqComponent} from './about-faq/about-faq.component';
import {AboutNumbersComponent} from './about-numbers/about-numbers.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [
    AboutHeroComponent,
    AboutNumbersComponent,
    AboutBenefitsComponent,
    AboutCustomersComponent,
    AboutFaqComponent,
  ],
})
export class AboutComponent {}
