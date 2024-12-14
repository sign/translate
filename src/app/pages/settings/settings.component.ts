import {Component} from '@angular/core';
import {SettingsMenuComponent} from './settings-menu/settings-menu.component';
import {IonNav} from '@ionic/angular/standalone';

@Component({
  template: '<ion-nav [root]="component"></ion-nav>',
  imports: [IonNav],
})
export class SettingsPageComponent {
  component = SettingsMenuComponent;
}
