import {Component} from '@angular/core';
import {BaseSettingsComponent} from '../../../modules/settings/settings.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AsyncPipe} from '@angular/common';
import {IonFab, IonFabButton, IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {videocamOffOutline, videocamOutline} from 'ionicons/icons';
import {TranslocoDirective} from '@jsverse/transloco';

@Component({
  selector: 'app-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.scss'],
  imports: [MatTooltipModule, AsyncPipe, IonFab, IonFabButton, IonIcon, TranslocoDirective],
})
export class VideoControlsComponent extends BaseSettingsComponent {
  constructor() {
    super();
    addIcons({videocamOutline, videocamOffOutline});
  }
}
