import {Component} from '@angular/core';
import {
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-about-customers',
  templateUrl: './about-customers.component.html',
  styleUrls: ['./about-customers.component.scss'],
  imports: [IonList, IonBadge, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle],
})
export class AboutCustomersComponent {
  activeCustomer = 0;

  customers = [
    {
      key: 'streaming',
      sector: 'Online Streaming',
      description:
        'Translate speech into sign language, allowing deaf viewers to fully enjoy movies and shows, setting a new standard for inclusivity in streaming.',
    },
    {
      key: 'transport',
      sector: 'Public Transportation',
      description:
        'Provide real-time sign language announcements on delays and platform changes, ensuring all passengers receive timely information.',
    },
    {
      key: 'education',
      sector: 'Education',
      description:
        'Integrate sign language into language courses, catering to deaf and hearing learners, promoting sign language education.',
    },
    {
      key: 'meetings',
      sector: 'Meetings',
      description:
        'Translate between spoken and sign language during meetings, enabling full participation for deaf and hard-of-hearing users.',
    },
    {
      key: 'fast-food',
      sector: 'Fast Food',
      description:
        'Integrate sign language translation at kiosks and drive-thrus, creating an inclusive ordering experience for all customers.',
    },
    {
      key: 'vr',
      sector: 'Virtual Reality',
      description:
        'Incorporate sign language translation in augmented reality environments, allowing deaf users to engage fully with immersive experiences.',
    },
    {
      key: 'tv',
      sector: 'Broadcasting',
      description:
        'Provide real-time sign language interpretation for live broadcasts and news programs, ensuring that deaf viewers have equal access to information.',
    },
    {
      key: 'museums',
      sector: 'Museums',
      description:
        'Offer sign language guided tours and interactive exhibits, making art and culture more accessible to deaf visitors, enriching their museum experience.',
    },
    {
      key: 'events',
      sector: 'International Events',
      description:
        'Translate commentary and announcements into sign language during international events, ensuring that deaf athletes and spectators are fully engaged and informed.',
    },
  ];

  logoPath(key: string) {
    return `assets/promotional/customers/logos/${key}.svg`;
  }

  coverPath(key: string) {
    return `assets/promotional/customers/covers/${key}.webp`;
  }
}
