import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {SetSetting} from '../../modules/settings/settings.actions';
import {fromEvent, Observable} from 'rxjs';
import {BaseComponent} from '../../components/base/base.component';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {TranslocoService} from '@ngneat/transloco';
import {TranslationService} from '../../modules/translate/translate.service';
import {Meta, Title} from '@angular/platform-browser';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss'],
})
export class TranslateComponent extends BaseComponent implements OnInit {
  spokenToSigned$: Observable<boolean>;
  spokenToSigned: boolean;

  isMobile: MediaQueryList;

  constructor(
    private store: Store,
    private transloco: TranslocoService,
    public translation: TranslationService,
    private mediaMatcher: MediaMatcher,
    private meta: Meta,
    private title: Title
  ) {
    super();

    this.spokenToSigned$ = this.store.select<boolean>(state => state.translate.spokenToSigned);
    this.isMobile = this.mediaMatcher.matchMedia('screen and (max-width: 599px)');

    // Default settings
    this.store.dispatch([
      new SetSetting('receiveVideo', true),
      new SetSetting('detectSign', false),
      new SetSetting('drawSignWriting', false), // This setting currently also controls loading the SignWriting models.
      new SetSetting('drawPose', true),
      new SetSetting('poseViewer', 'pose'),
    ]);
  }

  ngOnInit(): void {
    this.transloco.events$
      .pipe(
        tap(() => {
          this.title.setTitle(this.transloco.translate('translate.title'));
          this.meta.updateTag(
            {
              name: 'description',
              content: this.transloco.translate('translate.description'),
            },
            'name=description'
          );
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.spokenToSigned$
      .pipe(
        filter(spokenToSigned => !spokenToSigned),
        tap(() => {
          this.store.dispatch(new SetSetting('drawSignWriting', true));
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.playVideos();
  }

  async playVideos(): Promise<void> {
    if (!('window' in globalThis)) {
      return;
    }

    // Autoplay videos don't play before page interaction, or after re-opening PWA without refresh
    fromEvent(window, 'click')
      .pipe(
        tap(async () => {
          const videos = Array.from(document.getElementsByTagName('video'));

          for (const video of videos) {
            if (video.autoplay && video.paused) {
              try {
                await video.play();
              } catch (e) {
                console.error(e);
              }
            }
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
