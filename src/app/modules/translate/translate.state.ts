import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Select, State, StateContext} from '@ngxs/store';
// tslint:disable-next-line:max-line-length
import {ChangeTranslation, CopySignedLanguageVideo, DownloadSignedLanguageVideo, FlipTranslationDirection, SetInputMode, SetSignedLanguage, SetSignedLanguageVideo, SetSpokenLanguage, SetSpokenLanguageText, ShareSignedLanguageVideo} from './translate.actions';
import {TranslationService} from './translate.service';
import {StartCamera, StopVideo} from '../../core/modules/ngxs/store/video/video.actions';
import {Observable} from 'rxjs';
import {PoseViewerSetting} from '../settings/settings.state';
import {tap} from 'rxjs/operators';

export type InputMode = 'webcam' | 'upload' | 'text';

export interface TranslateStateModel {
  spokenToSigned: boolean;
  inputMode: InputMode;

  spokenLanguage: string;
  signedLanguage: string;

  spokenLanguageText: string;
  signedLanguagePose: string;
  signedLanguageVideo: string;
}

const initialState: TranslateStateModel = {
  spokenToSigned: true,
  inputMode: 'text',

  spokenLanguage: 'en',
  signedLanguage: 'us',

  spokenLanguageText: 'Test',
  signedLanguagePose: null,
  signedLanguageVideo: null
};

@Injectable()
@State<TranslateStateModel>({
  name: 'translate',
  defaults: initialState
})
export class TranslateState implements NgxsOnInit {
  @Select(state => state.settings.poseViewer) poseViewerSetting$: Observable<PoseViewerSetting>;

  constructor(private service: TranslationService) {
  }

  ngxsOnInit({dispatch}: StateContext<TranslateStateModel>): any {
    dispatch(ChangeTranslation);

    // Reset video whenever viewer setting changes
    this.poseViewerSetting$.pipe(
      tap(() => dispatch(new SetSignedLanguageVideo(null)))
    ).subscribe();
  }

  @Action(FlipTranslationDirection)
  async flipTranslationMode({getState, patchState, dispatch}: StateContext<TranslateStateModel>): Promise<void> {
    const {spokenToSigned} = getState();
    patchState({spokenToSigned: !spokenToSigned});
    dispatch(new SetInputMode(spokenToSigned ? 'webcam' : 'text'));
  }

  @Action(SetInputMode)
  async setInputMode({patchState, dispatch}: StateContext<TranslateStateModel>, {mode}: SetInputMode): Promise<void> {
    patchState({inputMode: mode});

    dispatch([StopVideo, ChangeTranslation]);

    if (mode === 'webcam') {
      dispatch(StartCamera);
    }
  }

  @Action(SetSpokenLanguage)
  async setSpokenLanguage({patchState, dispatch}: StateContext<TranslateStateModel>, {language}: SetSpokenLanguage): Promise<void> {
    patchState({spokenLanguage: language});
    dispatch(ChangeTranslation);
  }

  @Action(SetSignedLanguage)
  async setSignedLanguage({patchState, dispatch}: StateContext<TranslateStateModel>, {language}: SetSignedLanguage): Promise<void> {
    patchState({signedLanguage: language});
    dispatch(ChangeTranslation);
  }

  @Action(SetSpokenLanguageText)
  async setSpokenLanguageText({patchState, dispatch}: StateContext<TranslateStateModel>, {text}: SetSpokenLanguageText): Promise<void> {
    patchState({spokenLanguageText: text});
    dispatch(ChangeTranslation);
  }

  @Action(SetSignedLanguageVideo)
  async setSignedLanguageVideo({patchState, dispatch}: StateContext<TranslateStateModel>, {url}: SetSignedLanguageVideo): Promise<void> {
    patchState({signedLanguageVideo: url});
  }

  @Action(ChangeTranslation)
  async changeTranslation({getState, patchState}: StateContext<TranslateStateModel>): Promise<void> {
    const {spokenToSigned, spokenLanguage, signedLanguage, spokenLanguageText} = getState();
    if (spokenToSigned) {
      patchState({signedLanguageVideo: null}); // Always reset the signed language video

      if (!spokenLanguageText) {
        patchState({signedLanguagePose: null});
      } else {
        const path = this.service.translateSpokenToSigned(spokenLanguageText, spokenLanguage, signedLanguage);
        patchState({signedLanguagePose: path});
      }
    }
  }

  @Action(CopySignedLanguageVideo)
  async copySignedLanguageVideo({getState}: StateContext<TranslateStateModel>): Promise<void> {
    const {signedLanguageVideo} = getState();

    const data = await fetch(signedLanguageVideo);
    const blob = await data.blob();

    const item = new ClipboardItem({[blob.type]: blob});
    await navigator.clipboard.write([item]);
  }

  @Action(ShareSignedLanguageVideo)
  async shareSignedLanguageVideo({getState}: StateContext<TranslateStateModel>): Promise<void> {
    const {signedLanguageVideo} = getState();

    const data = await fetch(signedLanguageVideo);
    const blob = await data.blob();

    const files: File[] = [new File([blob], 'video.webm', {type: blob.type})];

    const url = window.location.href;
    const title = 'Signed Language Video for text';

    if ('canShare' in navigator && (navigator as any).canShare({files})) {
      await navigator.share({
        text: 'FILE',
        files,
        title,
        url
      } as ShareData);
    } else {
      // TODO convert the video to GIF, try to share the GIF.
      await navigator.share({
        text: 'NO FILE',
        title,
        url
      });
    }
  }

  @Action(DownloadSignedLanguageVideo)
  async downloadSignedLanguageVideo({getState}: StateContext<TranslateStateModel>): Promise<void> {
    const {signedLanguageVideo} = getState();

    const a = document.createElement('a');
    a.href = signedLanguageVideo;
    a.download = signedLanguageVideo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
