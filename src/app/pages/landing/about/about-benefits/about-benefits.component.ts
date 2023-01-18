import {Component} from '@angular/core';

@Component({
  selector: 'app-about-benefits',
  templateUrl: './about-benefits.component.html',
  styleUrls: ['./about-benefits.component.scss'],
})
export class AboutBenefitsComponent {
  benefits = [
    {
      title: 'Real-time translation',
      subtitle: 'Translate between 40+ signed and spoken languages in real-time',
      content:
        'Our app allows you to communicate naturally and easily with anyone, anywhere, anytime, in your own sign language.',
    },
    {
      title: 'Offline functionality',
      subtitle: "Communicate even when you're not connected to the internet",
      content:
        "Our app works offline, so you can communicate even when you're not connected to the internet or in areas with limited connectivity.",
    },
    {
      title: 'Multilingual support',
      subtitle: 'Translate between different sign languages and spoken languages',
      content:
        'Our app supports multiple sign languages and spoken languages, so you can communicate with people from different countries and cultures.',
    },
  ];
}
