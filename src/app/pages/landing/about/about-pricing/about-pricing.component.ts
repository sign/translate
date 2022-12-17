import {Component} from '@angular/core';

@Component({
  selector: 'app-about-pricing',
  templateUrl: './about-pricing.component.html',
  styleUrls: ['./about-pricing.component.scss'],
})
export class AboutPricingComponent {
  pricingOptions = [
    {
      name: 'Free App',
      price: 'Free',
      features: [
        'Real-time translation between signed and spoken languages',
        'Multilingual support for over 40 languages',
        'Offline capability',
      ],
      action: 'Translate Now',
      link: '/',
    },
    {
      name: 'Business Solution',
      price: '$1,500 implementation fee + $340/month per branch',
      features: [
        'Customization and personalization of the platform to match the needs and design of each restaurant',
        'Hardware costs for the device on which the software is run',
        'Real-time translation between signed and spoken languages',
        'Multilingual support for over 40 languages',
        'Offline capability',
      ],
      action: 'Contact Us',
      link: 'mailto:contact@sign.mt',
    },
  ];
}
