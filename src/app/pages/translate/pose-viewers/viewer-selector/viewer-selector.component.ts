import {Component, OnInit, inject} from '@angular/core';
import {BaseSettingsComponent} from '../../../../modules/settings/settings.component';
import {Store} from '@ngxs/store';
import {PoseViewerSetting} from '../../../../modules/settings/settings.state';
import {takeUntil, tap} from 'rxjs/operators';
import {IonFab, IonFabButton, IonFabList, IonIcon} from '@ionic/angular/standalone';
import {accessibility, gitCommit, logoAppleAr} from 'ionicons/icons';
import {addIcons} from 'ionicons';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslocoDirective} from '@ngneat/transloco';

export interface MatFabMenu {
  id: string;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'app-viewer-selector',
  templateUrl: './viewer-selector.component.html',
  styleUrls: ['./viewer-selector.component.scss'],
  standalone: true,
  imports: [IonFab, IonFabList, IonFabButton, IonIcon, MatTooltip, TranslocoDirective],
})
export class ViewerSelectorComponent extends BaseSettingsComponent implements OnInit {
  poseViewerSetting$ = this.store.select<PoseViewerSetting>(state => state.settings.poseViewer);

  buttons: MatFabMenu[] = [
    {id: 'pose', icon: 'git-commit', color: 'light'},
    {id: 'avatar', icon: 'logo-apple-ar', color: 'primary'},
    {id: 'person', icon: 'accessibility', color: 'success'},
  ];

  fab: MatFabMenu;
  fabButtons: MatFabMenu[] = [];

  constructor() {
    super();
    addIcons({gitCommit, logoAppleAr, accessibility});
  }

  ngOnInit(): void {
    this.poseViewerSetting$
      .pipe(
        tap(setting => {
          this.fabButtons = [];
          for (const button of this.buttons) {
            if (button.id === setting) {
              this.fab = button;
            } else {
              this.fabButtons.push(button);
            }
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
