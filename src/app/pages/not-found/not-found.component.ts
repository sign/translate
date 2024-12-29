import {Component} from '@angular/core';
import {IonButton, IonContent} from '@ionic/angular/standalone';
import {TranslocoPipe} from '@jsverse/transloco';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  imports: [IonContent, IonButton, TranslocoPipe, RouterLink],
})
export class NotFoundComponent {}
