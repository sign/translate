import {SettingsStateModel} from './settings.state';
import {SetSetting} from './settings.actions';
import {Store} from '@ngxs/store';
import {BaseComponent} from '../../components/base/base.component';
import {Directive, inject} from '@angular/core';
import {Observable} from 'rxjs';

@Directive()
export abstract class BaseSettingsComponent extends BaseComponent {
  protected store = inject(Store);

  settingsState$: Observable<SettingsStateModel>;

  constructor() {
    super();

    this.settingsState$ = this.store.select<SettingsStateModel>(state => state.settings);
  }

  applySetting(setting: keyof SettingsStateModel, value: any): void {
    this.store.dispatch(new SetSetting(setting, value));
  }
}
