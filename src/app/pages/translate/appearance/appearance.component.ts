import {Component} from '@angular/core';
import {Store} from '@ngxs/store';
import {BaseSettingsComponent} from '../../../modules/settings/settings.component';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss'],
})
export class AppearanceComponent extends BaseSettingsComponent {
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
