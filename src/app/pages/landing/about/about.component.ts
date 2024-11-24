import {Component} from '@angular/core';
import {AboutHeroComponent} from './about-hero/about-hero.component';
import {AboutBenefitsComponent} from './about-benefits/about-benefits.component';
import {AboutCustomersComponent} from './about-customers/about-customers.component';
import {AboutTeamComponent} from './about-team/about-team.component';
import {AboutFaqComponent} from './about-faq/about-faq.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [AboutHeroComponent, AboutBenefitsComponent, AboutCustomersComponent, AboutTeamComponent, AboutFaqComponent],
})
export class AboutComponent {}
