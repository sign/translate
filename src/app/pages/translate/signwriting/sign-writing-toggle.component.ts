import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {TranslocoPipe} from '@jsverse/transloco';
import {IonButton, IonIcon, IonToggle} from '@ionic/angular/standalone';
import {MatMenuModule} from '@angular/material/menu';
import {addIcons} from 'ionicons';
import {ellipsisHorizontal} from 'ionicons/icons';
import {SetSetting} from '../../../modules/settings/settings.actions';
import {saveSignWritingPreference} from './sign-writing-preference';

@Component({
  selector: 'app-sign-writing-toggle',
  templateUrl: './sign-writing-toggle.component.html',
  styleUrls: ['./sign-writing-toggle.component.scss'],
  imports: [AsyncPipe, TranslocoPipe, IonButton, IonIcon, IonToggle, MatMenuModule],
})
export class SignWritingToggleComponent {
  private store = inject(Store);
  drawSignWriting$: Observable<boolean> = this.store.select<boolean>(state => state.settings.drawSignWriting);

  constructor() {
    addIcons({ellipsisHorizontal});
  }

  setDrawSignWriting(event: Event): void {
    const checked = (event as CustomEvent<{checked: boolean}>).detail.checked;
    this.store.dispatch(new SetSetting('drawSignWriting', checked));
    saveSignWritingPreference(checked);
  }
}
