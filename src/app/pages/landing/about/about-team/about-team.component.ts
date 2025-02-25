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
      bio: 'Mission-driven entrepreneur using technology to improve society. Led digital solutions in public sector, finance, and LegalTech. Holds a Master of Law from the University of Bern.',
    },
    {
      name: 'Dr. Amit Moryossef',
      avatar: 'assets/promotional/about/team/amit-moryossef.jpg',
      title: 'CTO',
      bio: 'Experienced CTO. Award-winning expert in sign language technology. Ex-Google in the sign language team, Ph.D. in Computer Science.',
    },
  ];
}
