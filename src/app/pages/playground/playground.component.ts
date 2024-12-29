import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {BaseComponent} from '../../components/base/base.component';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {SetVideo, StartCamera} from '../../core/modules/ngxs/store/video/video.actions';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {Observable} from 'rxjs';
import {IonContent, IonHeader, IonIcon, IonMenu, IonSplitPane, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {SettingsComponent} from '../../modules/settings/settings/settings.component';
import {earOutline} from 'ionicons/icons';
import {addIcons} from 'ionicons';
import {VideoModule} from '../../components/video/video.module';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  imports: [
    IonSplitPane,
    IonContent,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    VideoModule,
    SettingsComponent,
    IonIcon,
    TranslocoPipe,
  ],
})
export class PlaygroundComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  private translocoService = inject(TranslocoService);

  receiveVideo$: Observable<boolean>;

  constructor() {
    super();

    this.receiveVideo$ = this.store.select<boolean>(state => state.settings.receiveVideo);

    addIcons({earOutline});
  }

  ngOnInit(): void {
    this.translocoService.events$
      .pipe(
        tap(() => (document.title = this.translocoService.translate('playground.title'))),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.receiveVideo$
      .pipe(
        filter(Boolean),
        tap(() => this.store.dispatch(StartCamera)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.store.dispatch(new SetVideo('assets/tmp/example-sentence.mp4'));
  }
}
