import {Component} from '@angular/core';
import {IonAvatar, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle} from '@ionic/angular/standalone';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss'],
  imports: [IonCard, IonBadge, IonCardHeader, IonAvatar, IonCardTitle, IonCardContent],
})
export class AboutTeamComponent {
  teamMembers = [
    {
      name: 'Timothy Rabozzi',
      avatar: 'assets/promotional/about/team/timothy-rabozzi.jpg',
      title: 'CEO',
      bio: 'Experienced in leading innovation in LegalTech, politics and regulated industries with a Master of Law from the University of Bern.',
    },
    {
      name: 'Dr. Amit Moryossef',
      avatar: 'assets/promotional/about/team/amit-moryossef.jpg',
      title: 'CTO',
      bio: 'Experienced CTO. Award-winning expert in sign language technology. Ex-Google in the sign language team, Ph.D. in Computer Science.',
    },
    {
      name: 'Eliyahu Moryossef',
      avatar: 'assets/promotional/about/team/eliyahu-moryossef.jpg',
      title: 'CMO',
      bio: 'Experienced sales and marketing manager with a B.A. in Public Administration, studying for a Master of Business Administration (MBA).',
    },
  ];
}
