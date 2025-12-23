import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../components/base/base.component';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {TranslateInputButtonComponent} from '../input/button/button.component';
import {LanguageSelectorsComponent} from '../language-selectors/language-selectors.component';
import {SendFeedbackComponent} from '../send-feedback/send-feedback.component';
import {TranslocoPipe} from '@jsverse/transloco';
import {NtkmeButtonModule} from '@ctrl/ngx-github-buttons';
import {SpokenToSignedComponent} from '../spoken-to-signed/spoken-to-signed.component';
import {SignedToSpokenComponent} from '../signed-to-spoken/signed-to-spoken.component';
import {DropPoseFileComponent} from '../drop-pose-file/drop-pose-file.component';
import {addIcons} from 'ionicons';
import {cloudUpload, informationCircleOutline, language, videocam} from 'ionicons/icons';
import {RouterLink} from '@angular/router';
import {LogoComponent} from '../../../components/logo/logo.component';
import {AnnouncementBannerComponent} from '../../../components/announcement-banner/announcement-banner.component';
import {LandingFooterComponent} from '../../landing/landing-footer/landing-footer.component';

@Component({
  selector: 'app-translate-desktop',
  templateUrl: './translate-desktop.component.html',
  styleUrls: ['./translate-desktop.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonTitle,
    IonIcon,
    TranslateInputButtonComponent,
    LanguageSelectorsComponent,
    SendFeedbackComponent,
    TranslocoPipe,
    SpokenToSignedComponent,
    SignedToSpokenComponent,
    DropPoseFileComponent,
    IonButton,
    RouterLink,
    LogoComponent,
    AnnouncementBannerComponent,
    LandingFooterComponent,
  ],
})
export class TranslateDesktopComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  spokenToSigned$ = this.store.select<boolean>(state => state.translate.spokenToSigned);

  pages = [
    {key: 'home', route: '/'},
    {key: 'contribute', route: '/about/contribute'},
  ];

  spokenToSigned: boolean;

  constructor() {
    super();

    addIcons({language, videocam, cloudUpload, informationCircleOutline});
  }

  ngOnInit(): void {
    this.spokenToSigned$
      .pipe(
        tap(spokenToSigned => (this.spokenToSigned = spokenToSigned)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
