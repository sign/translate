import {Component} from '@angular/core';
import {IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle} from '@ionic/angular/standalone';

@Component({
  selector: 'app-about-numbers',
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge],
  templateUrl: './about-numbers.component.html',
  styleUrl: './about-numbers.component.scss',
})
export class AboutNumbersComponent {
  facts = [
    {
      title: '70,000,000',
      description:
        'Globally there are 70 million deaf people. By 2050, over 700 million people could have disabling hearing loss.',
      source: 'https://sign.mt/docs/docs/facts/population.html#deafness',
      color: 'primary',
    },
    {
      title: 'Literacy Challenge',
      description:
        'Spoken language literacy rates among deaf individuals are uncertain, with estimates ranging from 20% to 50%.',
      source: 'https://sign.mt/docs/docs/facts/literacy.html',
      color: 'warning',
    },
    {
      title: '$33.7B',
      description:
        'The U.S. sign language translation market is worth $11B, with a global estimate of $33.7B across 30 developed nations.',
      source: 'https://sign.mt/docs/docs/facts/market.html',
      color: 'success',
    },
    {
      title: '3x 1million+',
      description: 'Our technology is being reviewed by three enterprises, each with over 1 million retail customers.',
    },
    {
      title: '+200 Languages',
      description:
        'Our translation solution currently partially supports 43 of the 200+ major sign languages to some extent, with exciting plans to expand further.',
      source: 'https://sign.mt/docs/docs/facts/population.html#deafness',
      color: 'tertiary',
    },
    {
      title: 'Reviews and Awards',
      description:
        'Independently reviewed with multiple awards, praised for innovation and effectiveness in Natural Language Processing.',
      source: 'https://sign.mt/docs/docs/technology/awards.html',
      color: 'danger',
    },
  ];
}
