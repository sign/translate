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
    'pose',
    'drawPose',
    'drawSignWriting',
    'animatePose',
  ];
  lastSettings = [];
  currentSettings = [];

  constructor(store: Store) {
    super(store);
  }

  ngOnInit(): void {
    this.settingsState$
      .pipe(
        tap(settings => {
          this.currentSettings = this.lastSettings = this.availableSettings.filter(s => settings[s]);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  onSettingsChange(currentSettings: Array<keyof SettingsStateModel>): void {
    this.availableSettings.forEach(s => {
      if (this.lastSettings.includes(s) && !currentSettings.includes(s)) {
        this.applySetting(s, false);
      } else if (!this.lastSettings.includes(s) && currentSettings.includes(s)) {
        this.applySetting(s, true);
      }
    });
  }
}
