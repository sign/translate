import {Component} from '@angular/core';
import {BaseSettingsComponent} from '../../../modules/settings/settings.component';
import {Store} from '@ngxs/store';

@Component({
  templateUrl: './settings-appearance.component.html',
  styleUrls: ['./settings-appearance.component.scss'],
})
export class SettingsAppearanceComponent extends BaseSettingsComponent {
  appearances = [
    {src: 'assets/appearance/maayan.png', title: 'Maayan', value: '#ffc8c8', disabled: false},
    {src: 'assets/appearance/amit.png', title: 'Amit', value: '#c8c8ff', disabled: false},
    {src: 'assets/appearance/random-3.jpg', title: 'Random', value: '', disabled: true},
    {src: 'assets/appearance/random-4.jpg', title: 'Random', value: '', disabled: true},
    {src: 'assets/appearance/random-5.jpg', title: 'Random', value: '', disabled: true},
    {src: 'assets/appearance/random-6.jpg', title: 'Random', value: '', disabled: true},
    {src: 'assets/appearance/random-7.jpg', title: 'Random', value: '', disabled: true},
  ];

  constructor(store: Store) {
    super(store);
  }
}
