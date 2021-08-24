import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BaseComponent} from '../../../components/base/base.component';
import {debounce, takeUntil, tap} from 'rxjs/operators';
import {interval, Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {CopySignedLanguageVideo, DownloadSignedLanguageVideo, SetSpokenLanguageText, ShareSignedLanguageVideo} from '../../../modules/translate/translate.actions';
import {PoseViewerSetting} from '../../../modules/settings/settings.state';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {TranslateStateModel} from '../../../modules/translate/translate.state';

@Component({
  selector: 'app-spoken-to-signed',
  templateUrl: './spoken-to-signed.component.html',
  styleUrls: ['./spoken-to-signed.component.scss']
})
export class SpokenToSignedComponent extends BaseComponent implements OnInit {
  @Select(state => state.settings.poseViewer) poseViewerSetting$: Observable<PoseViewerSetting>;
  @Select(state => state.translate) translate$: Observable<TranslateStateModel>;
  @Select(state => state.translate.spokenLanguageText) text$: Observable<string>;
  @Select(state => state.translate.signedLanguagePose) pose$: Observable<string>;
  @Select(state => state.translate.signedLanguageVideo) video$: Observable<string>;

  videoUrl: SafeUrl;
  spokenLanguage: string;

  text = new FormControl();
  maxTextLength = 500;

  // signWriting = [];
  signWriting = ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20600489x476', 'AS14c31S14c39S27102S27116S30300S30a00S36e00M554x585S30a00481x488S30300481x477S14c31508x546S14c39465x545S27102539x545S27116445x545'];

  constructor(private store: Store, private domSanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.translate$.pipe(
      tap(({spokenLanguage, detectedLanguage}) => this.spokenLanguage = spokenLanguage || detectedLanguage),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    // Local text changes
    this.text.valueChanges.pipe(
      debounce(() => interval(500)),
      tap((text) => this.store.dispatch(new SetSpokenLanguageText(text))),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    // Changes from the store
    this.text$.pipe(
      tap((text) => this.text.setValue(text)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    this.video$.pipe(
      tap((url) => {
        this.videoUrl = url ? this.domSanitizer.bypassSecurityTrustUrl(url) : null;
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  shareIcon(): string {
    const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);
    return isIOS || isMacLike ? 'ios_share' : 'share';
  }

  copyTranslation(): void {
    this.store.dispatch(CopySignedLanguageVideo);
  }

  downloadTranslation(): void {
    this.store.dispatch(DownloadSignedLanguageVideo);
  }

  shareTranslation(): void {
    this.store.dispatch(ShareSignedLanguageVideo);
  }
}
