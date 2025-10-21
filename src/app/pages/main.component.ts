import {Component, inject} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs} from '@ionic/angular/standalone';
import {home, person} from 'ionicons/icons';
import {addIcons} from 'ionicons';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    IonTabs, //, IonTabBar, IonTabButton, IonIcon, IonLabel
  ],
})
export class MainComponent {
  private router = inject(Router);
  isMainPage$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.urlAfterRedirects === '/')
  );

  constructor() {
    addIcons({home, person});
  }
}
