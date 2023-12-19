import {Component, Input} from '@angular/core';
import {BaseSettingsComponent} from '../../../../modules/settings/settings.component';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-settings-appearance-images',
  templateUrl: './settings-appearance-images.component.html',
  styleUrls: ['./settings-appearance-images.component.scss'],
})
export class SettingsAppearanceImagesComponent extends BaseSettingsComponent {
  @Input() scale = 1;

  appearances = [
    {src: 'assets/appearance/maayan.png', title: 'Maayan', value: '#ffffff', disabled: false},
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
