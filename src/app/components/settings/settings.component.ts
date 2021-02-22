import {Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {SettingsStateModel} from '../../core/modules/ngxs/store/settings/settings.state';
import {SetSetting} from '../../core/modules/ngxs/store/settings/settings.actions';

export class BaseSettingsComponent {
  @Select(state => state.settings) settingsState$: Observable<SettingsStateModel>;

  constructor(private store: Store) {
  }


  applySetting(setting: string, value: any): void {
    this.store.dispatch(new SetSetting(setting, value));
  }
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BaseSettingsComponent {
  constructor(store: Store) {
    super(store);
  }
}
