import {Component} from '@angular/core';
import {IonBadge, IonButton, IonIcon} from '@ionic/angular/standalone';
import {RouterLink} from '@angular/router';
import {arrowForward} from 'ionicons/icons';
import {addIcons} from 'ionicons';
import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  selector: 'app-about-hero',
  templateUrl: './about-hero.component.html',
  styleUrls: ['./about-hero.component.scss'],
  imports: [IonBadge, IonButton, RouterLink, IonIcon, TranslocoPipe],
})
export class AboutHeroComponent {
  constructor() {
    addIcons({arrowForward});
  }
}
