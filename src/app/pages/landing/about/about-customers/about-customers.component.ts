import {Component} from '@angular/core';

@Component({
  selector: 'app-about-customers',
  templateUrl: './about-customers.component.html',
  styleUrls: ['./about-customers.component.scss'],
})
export class AboutCustomersComponent {
  activeCustomer = 0;

  customers = [
    {
      key: 'netflix',
      sector: 'Online Streaming',
      company: 'Netflix',
      description:
        'Translate speech into sign language, allowing deaf viewers to fully enjoy movies and shows, setting a new standard for inclusivity in streaming.',
    },
    {
      key: 'sbb',
      sector: 'Public Transportation',
      company: 'Swiss Federal Railways (SBB)',
      description:
        'Provide real-time sign language announcements on delays and platform changes, ensuring all passengers receive timely information.',
    },
    {
      key: 'duolingo',
      sector: 'Education',
      company: 'Duolingo',
      description:
        'Integrate sign language into language courses, catering to deaf and hearing learners, promoting sign language education.',
    },
    {
      key: 'zoom',
      sector: 'Meetings',
      company: 'Zoom',
      description:
        'Translate between spoken and sign language during meetings, enabling full participation for deaf and hard-of-hearing users.',
    },
    {
      key: 'mcdonalds',
      sector: 'Fast Food',
      company: "McDonald's",
      description:
        'Integrate sign language translation at kiosks and drive-thrus, creating an inclusive ordering experience for all customers.',
    },
    {
      key: 'apple',
      sector: 'Virtual Reality',
      company: 'Apple',
      description:
        'Incorporate sign language translation in augmented reality environments, allowing deaf users to engage fully with immersive experiences.',
    },
    {
      key: 'bbc',
      sector: 'Broadcasting',
      company: 'BBC',
      description:
        'Provide real-time sign language interpretation for live broadcasts and news programs, ensuring that deaf viewers have equal access to information.',
    },
    {
      key: 'louvre',
      sector: 'Museums',
      company: 'The Louvre',
      description:
        'Offer sign language guided tours and interactive exhibits, making art and culture more accessible to deaf visitors, enriching their museum experience.',
    },
    {
      key: 'olympics',
      sector: 'International Events',
      company: 'The Olympic Games',
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
