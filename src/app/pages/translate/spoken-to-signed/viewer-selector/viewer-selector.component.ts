import {Component, OnInit} from '@angular/core';
import {BaseSettingsComponent} from '../../../../modules/settings/settings.component';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {PoseViewerSetting} from '../../../../modules/settings/settings.state';
import {MatFabMenu} from '@angular-material-extensions/fab-menu';
import {takeUntil, tap} from 'rxjs/operators';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-viewer-selector',
  templateUrl: './viewer-selector.component.html',
  styleUrls: ['./viewer-selector.component.css']
})
export class ViewerSelectorComponent extends BaseSettingsComponent implements OnInit {
  @Select(state => state.settings.poseViewer) poseViewerSetting$: Observable<PoseViewerSetting>;

  buttons: MatFabMenu[] = [
    {id: 'pose', icon: 'timeline', color: 'primary', tooltipPosition: 'after'},
    {id: 'avatar', icon: 'view_in_ar', color: 'accent', tooltipPosition: 'after'},
    {id: 'human', icon: 'emoji_people', color: 'warn', tooltipPosition: 'after'},
  ];

  fab: MatFabMenu;
  fabButtons: MatFabMenu[] = [];

  constructor(store: Store, private transloco: TranslocoService) {
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

    this.updateTooltips();
  }

  updateTooltips(): void {
    const updateTooltips = () => {
      for (const button of this.buttons) {
        button.tooltip = this.transloco.translate('settings.poseViewer.' + button.id);
      }
    };

    updateTooltips();
    this.transloco.events$.pipe(
      tap(() => updateTooltips),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }
}
