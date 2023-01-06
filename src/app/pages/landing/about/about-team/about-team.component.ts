import {Component} from '@angular/core';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss'],
})
export class AboutTeamComponent {
  teamMembers = [
    {
      name: 'Amit Moryossef',
      avatar: 'assets/promotional/about/team/amit-moryossef.jpg',
      title: 'CTO',
      bio: 'Ex-Google, PH.D. student of Computer Science, experienced CTO and leading expert in sign language technologies research.',
    },
    {
      name: 'Eliyahu Moryossef',
      avatar: 'assets/promotional/about/team/eliyahu-moryossef.jpg',
      title: 'CMO, Acting CEO',
      bio: 'Experienced sales and marketing manager with a B.A. in Law, Business Administration, and Political Science.',
    },
  ];
}
