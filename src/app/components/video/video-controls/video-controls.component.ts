import {Component} from '@angular/core';
import {Store} from '@ngxs/store';
import {BaseSettingsComponent} from '../../../modules/settings/settings.component';

@Component({
  selector: 'app-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.scss'],
})
export class VideoControlsComponent extends BaseSettingsComponent {
  constructor(store: Store) {
    super(store);
  }
}
