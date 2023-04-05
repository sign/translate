import {Component, OnInit} from '@angular/core';
import {BaseSettingsComponent} from '../settings.component';
import {takeUntil, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SettingsStateModel} from '../settings.state';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent extends BaseSettingsComponent implements OnInit {
  availableSettings: Array<keyof SettingsStateModel> = [
    'detectSign',
    'drawVideo',
    'drawPose',
    'drawSignWriting',
    'animatePose',
  ];
  settings = {};

  constructor(store: Store) {
    super(store);
  }

  ngOnInit(): void {
    this.settingsState$
      .pipe(
        tap(settings => (this.settings = settings)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  changeSetting(setting: keyof SettingsStateModel, event: Event) {
    this.applySetting(setting, (event as any).detail.checked);
  }
}
