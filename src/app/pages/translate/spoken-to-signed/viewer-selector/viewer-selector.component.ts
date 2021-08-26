import {Component, OnInit} from '@angular/core';
import {BaseSettingsComponent} from '../../../../modules/settings/settings.component';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {PoseViewerSetting} from '../../../../modules/settings/settings.state';
import {takeUntil, tap} from 'rxjs/operators';
import {ThemePalette} from '@angular/material/core';

export interface MatFabMenu {
  id: string;
  icon?: string;
  color?: ThemePalette;
}

@Component({
  selector: 'app-viewer-selector',
  templateUrl: './viewer-selector.component.html',
  styleUrls: ['./viewer-selector.component.scss']
})
export class ViewerSelectorComponent extends BaseSettingsComponent implements OnInit {
  @Select(state => state.settings.poseViewer) poseViewerSetting$: Observable<PoseViewerSetting>;

  buttons: MatFabMenu[] = [
    {id: 'human', icon: 'emoji_people', color: 'warn'},
    {id: 'avatar', icon: 'view_in_ar', color: 'accent'},
    {id: 'pose', icon: 'timeline', color: 'primary'},
  ];

  fab: MatFabMenu;
  fabButtons: MatFabMenu[] = [];

  constructor(store: Store) {
    super(store);
  }

  ngOnInit(): void {
    this.poseViewerSetting$.pipe(
      tap((setting) => {
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
    ).subscribe();
  }
}
