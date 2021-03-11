import {Component, OnInit} from '@angular/core';
import {BaseSettingsComponent} from '../settings.component';
import {takeUntil, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends BaseSettingsComponent implements OnInit {

  // availableSettings = ['detectSign', 'drawVideo', 'drawPose', 'drawSignWriting'];
  availableSettings = ['drawVideo', 'drawPose', 'drawSignWriting'];
  lastSettings = [];
  currentSettings = [];

  constructor(store: Store) {
    super(store);
  }

  ngOnInit(): void {
    this.settingsState$.pipe(
      tap((settings) => {
        this.currentSettings = this.lastSettings = this.availableSettings.filter(s => settings[s]);
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  onSettingsChange(currentSettings): void {
    this.availableSettings.forEach(s => {
      if (this.lastSettings.includes(s) && !currentSettings.includes(s)) {
        this.applySetting(s, false);
      } else if (!this.lastSettings.includes(s) && currentSettings.includes(s)) {
        this.applySetting(s, true);
      }
    });
  }

}
