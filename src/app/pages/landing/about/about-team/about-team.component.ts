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
      bio: 'Experienced CTO. Award-winning expert in sign language technology. Ex-Google in the sign language team, Ph.D. in Computer Science.',
    },
    {
      name: 'Eliyahu Moryossef',
      avatar: 'assets/promotional/about/team/eliyahu-moryossef.jpg',
      title: 'CMO, Acting CEO',
      bio: 'Experienced sales and marketing manager with a B.A. in Public Administration, studying for a Master of Business Administration (MBA).',
    },
  ];
}
