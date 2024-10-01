import {Component} from '@angular/core';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss'],
})
export class AboutTeamComponent {
  teamMembers = [
    {
      name: 'Timothy Rabozzi',
      avatar: 'assets/promotional/about/team/timothy-rabozzi.jpg',
      title: 'CEO',
      bio: 'CEO with a background in LegalTech, campaigning, and business analysis. Holds a Master of Law with a focus on public law and innovation from the University of Bern.',
    },
    {
      name: 'Amit Moryossef',
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
