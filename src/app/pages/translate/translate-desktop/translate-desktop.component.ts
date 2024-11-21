import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../components/base/base.component';
import {IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {SignedLanguageInputComponent} from '../signed-to-spoken/signed-language-input/signed-language-input.component';
import {TranslateInputButtonComponent} from '../input/button/button.component';
import {LanguageSelectorsComponent} from '../language-selectors/language-selectors.component';
import {SendFeedbackComponent} from '../send-feedback/send-feedback.component';
import {TranslocoPipe} from '@ngneat/transloco';
import {NtkmeButtonModule} from '@ctrl/ngx-github-buttons';
import {SpokenToSignedComponent} from '../spoken-to-signed/spoken-to-signed.component';
import {SignedToSpokenComponent} from '../signed-to-spoken/signed-to-spoken.component';
import {DropPoseFileComponent} from '../drop-pose-file/drop-pose-file.component';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-translate-desktop',
  templateUrl: './translate-desktop.component.html',
  styleUrls: ['./translate-desktop.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonTitle,
    TranslateInputButtonComponent,
    LanguageSelectorsComponent,
    SendFeedbackComponent,
    TranslocoPipe,
    SignedLanguageInputComponent,
    NtkmeButtonModule,
    SpokenToSignedComponent,
    SignedToSpokenComponent,
    DropPoseFileComponent,
    MatTooltip,
  ],
})
export class TranslateDesktopComponent extends BaseComponent implements OnInit {
  spokenToSigned$: Observable<boolean>;
  spokenToSigned: boolean;

  constructor(private store: Store) {
    super();

    this.spokenToSigned$ = this.store.select<boolean>(state => state.translate.spokenToSigned);
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
