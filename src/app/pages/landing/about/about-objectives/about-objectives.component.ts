import {Component} from '@angular/core';
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle} from '@ionic/angular/standalone';

@Component({
  selector: 'app-about-objectives',
  templateUrl: './about-objectives.component.html',
  styleUrls: ['./about-objectives.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class AboutObjectivesComponent {}
