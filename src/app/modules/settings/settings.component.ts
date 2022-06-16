import {SettingsStateModel} from './settings.state';
import {SetSetting} from './settings.actions';
import {Observable, of} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {BaseComponent} from '../../components/base/base.component';
import {Directive} from '@angular/core';

@Directive()
export abstract class BaseSettingsComponent extends BaseComponent {
  settingsState$: Observable<SettingsStateModel>;

  protected constructor(private store: Store) {
    super();
    this.settingsState$ = store.select(state => state.settings);
  }

  applySetting(setting: keyof SettingsStateModel, value: any): void {
    this.store.dispatch(new SetSetting(setting, value));
  }
}
