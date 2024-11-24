import {Component, inject} from '@angular/core';
import {Store} from '@ngxs/store';
import {BaseSettingsComponent} from '../../../modules/settings/settings.component';
import {MatTooltip} from '@angular/material/tooltip';
import {AsyncPipe} from '@angular/common';
import {IonFab, IonFabButton, IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {videocamOffOutline, videocamOutline} from 'ionicons/icons';
import {TranslocoDirective} from '@ngneat/transloco';

@Component({
  selector: 'app-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.scss'],
  standalone: true,
  imports: [MatTooltip, AsyncPipe, IonFab, IonFabButton, IonIcon, TranslocoDirective],
})
export class VideoControlsComponent extends BaseSettingsComponent {
  constructor() {
    super();
    addIcons({videocamOutline, videocamOffOutline});
  }
}
