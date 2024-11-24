import {Component} from '@angular/core';
import {SettingsMenuComponent} from './settings-menu/settings-menu.component';

@Component({
  template: '<ion-nav [root]="component"></ion-nav>',
})
export class SettingsPageComponent {
  component = SettingsMenuComponent;
}
