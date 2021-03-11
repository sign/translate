import {Component} from '@angular/core';
import {Store} from '@ngxs/store';
import {SetSetting} from '../../../modules/settings/settings.actions';

@Component({
  selector: 'app-audio-instructions',
  templateUrl: './audio-instructions.component.html',
  styleUrls: ['./audio-instructions.component.css']
})
export class AudioInstructionsComponent {

  constructor(private store: Store) {
  }

  activateMicrophone(): void {
    this.store.dispatch(new SetSetting('transmitAudio', true));
  }

}
