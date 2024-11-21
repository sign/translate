import {Component} from '@angular/core';
import {IonButton, IonContent} from '@ionic/angular/standalone';
import {TranslocoPipe} from '@ngneat/transloco';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton, TranslocoPipe, RouterLink],
})
export class NotFoundComponent {}
