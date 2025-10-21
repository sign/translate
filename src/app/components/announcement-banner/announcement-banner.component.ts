import {Component} from '@angular/core';
import {IonToolbar, IonTitle, IonButton} from '@ionic/angular/standalone';

@Component({
  selector: 'app-announcement-banner',
  standalone: true,
  imports: [IonToolbar, IonTitle, IonButton],
  templateUrl: './announcement-banner.component.html',
  styleUrl: './announcement-banner.component.scss',
})
export class AnnouncementBannerComponent {}
