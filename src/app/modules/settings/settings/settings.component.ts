import {Component, OnInit} from '@angular/core';
import {BaseSettingsComponent} from '../settings.component';
import {takeUntil, tap} from 'rxjs/operators';
import {SettingsStateModel} from '../settings.state';
import {TranslocoDirective} from '@jsverse/transloco';
import {IonCheckbox, IonItem, IonList} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [TranslocoDirective, IonList, IonItem, IonCheckbox],
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
