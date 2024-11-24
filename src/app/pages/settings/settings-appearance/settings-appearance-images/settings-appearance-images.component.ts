import {Component, Input} from '@angular/core';
import {BaseSettingsComponent} from '../../../../modules/settings/settings.component';
import {TranslocoDirective} from '@ngneat/transloco';
import {MatTooltip} from '@angular/material/tooltip';
import {IonicModule} from '@ionic/angular';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-settings-appearance-images',
  templateUrl: './settings-appearance-images.component.html',
  styleUrls: ['./settings-appearance-images.component.scss'],
  imports: [TranslocoDirective, MatTooltip, IonicModule, AsyncPipe],
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
}
