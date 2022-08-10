import {SettingsStateModel} from './settings.state';
import {SetSetting} from './settings.actions';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {BaseComponent} from '../../components/base/base.component';
import {Directive} from '@angular/core';

@Directive()
export abstract class BaseSettingsComponent extends BaseComponent {
  @Select(state => state.settings) settingsState$: Observable<SettingsStateModel>;

  protected constructor(private store: Store) {
    super();
  }

  applySetting(setting: keyof SettingsStateModel, value: any): void {
    this.store.dispatch(new SetSetting(setting, value));
  }
}
