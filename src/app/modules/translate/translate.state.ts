import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Select, State, StateContext} from '@ngxs/store';
// eslint-disable-next-line max-len
import {
  ChangeTranslation,
  CopySignedLanguageVideo,
  DownloadSignedLanguageVideo,
  FlipTranslationDirection,
  SetInputMode,
  SetSignedLanguage,
  SetSignedLanguageVideo,
  SetSignWritingText,
  SetSpokenLanguage,
  SetSpokenLanguageText,
  ShareSignedLanguageVideo,
  UploadPoseFile,
} from './translate.actions';
import {TranslationService} from './translate.service';
import {SetVideo, StartCamera, StopVideo} from '../../core/modules/ngxs/store/video/video.actions';
import {Observable, of} from 'rxjs';
import {PoseViewerSetting} from '../settings/settings.state';
import {tap} from 'rxjs/operators';
import {signNormalize} from '@sutton-signwriting/font-ttf/fsw/fsw';
import {font} from '@sutton-signwriting/font-ttf/index.js';
import {Capacitor} from '@capacitor/core';

export type InputMode = 'webcam' | 'upload' | 'text';

export interface TranslateStateModel {
  spokenToSigned: boolean;
  inputMode: InputMode;

  spokenLanguage: string;
  signedLanguage: string;
  detectedLanguage: string;

  spokenLanguageText: string;
  signWriting: string[];
  signedLanguagePose: string;
  signedLanguageVideo: string;
}

const initialState: TranslateStateModel = {
  spokenToSigned: true,
  inputMode: 'text',

  spokenLanguage: 'en',
  signedLanguage: 'us',
  detectedLanguage: null,

  spokenLanguageText: '',
  signWriting: [],
  signedLanguagePose: null,
  signedLanguageVideo: null,
};

@Injectable()
@State<TranslateStateModel>({
  name: 'translate',
  defaults: initialState,
})
export class TranslateState implements NgxsOnInit {
  @Select(state => state.settings.poseViewer) poseViewerSetting$: Observable<PoseViewerSetting>;

  constructor(private service: TranslationService) {}

  ngxsOnInit({dispatch}: StateContext<TranslateStateModel>): any {
    dispatch(ChangeTranslation);

    // Reset video whenever viewer setting changes
    this.poseViewerSetting$.pipe(tap(() => dispatch(new SetSignedLanguageVideo(null)))).subscribe();
  }

  @Action(FlipTranslationDirection)
  async flipTranslationMode({getState, patchState, dispatch}: StateContext<TranslateStateModel>): Promise<void> {
    const {spokenToSigned, spokenLanguage, signedLanguage, detectedLanguage, signedLanguageVideo} = getState();
    patchState({
      spokenToSigned: !spokenToSigned,
      // Collapse detected language if used
      spokenLanguage: spokenLanguage ?? detectedLanguage,
      signedLanguage: signedLanguage ?? detectedLanguage,
      detectedLanguage: null,
      signedLanguageVideo: null,
    });

    if (spokenToSigned) {
      if (signedLanguageVideo) {
        dispatch([new SetInputMode('upload'), new SetVideo(signedLanguageVideo)]);
      } else {
        dispatch(new SetInputMode('webcam'));
      }
    } else {
      dispatch(new SetInputMode('text'));
    }
  }

  @Action(SetInputMode)
  async setInputMode(
    {patchState, getState, dispatch}: StateContext<TranslateStateModel>,
    {mode}: SetInputMode
  ): Promise<void> {
    const {inputMode} = getState();
    if (inputMode === mode) {
      return;
    }

    patchState({inputMode: mode});

    dispatch([StopVideo, ChangeTranslation]);

    if (mode === 'webcam') {
      dispatch(StartCamera);
    }
  }

  @Action(SetSpokenLanguage)
  async setSpokenLanguage(
    {patchState, getState, dispatch}: StateContext<TranslateStateModel>,
    {language}: SetSpokenLanguage
  ): Promise<void> {
    patchState({spokenLanguage: language, detectedLanguage: null});

    // Load and apply language detection if selected
    if (!language) {
      await this.service.initCld();
      const {spokenLanguageText} = getState();
      if (spokenLanguageText) {
        const detectedLanguage = await this.service.detectSpokenLanguage(spokenLanguageText);
        patchState({detectedLanguage});
      }
    }

    dispatch(ChangeTranslation);
  }

  @Action(SetSignedLanguage)
  async setSignedLanguage(
    {patchState, dispatch}: StateContext<TranslateStateModel>,
    {language}: SetSignedLanguage
  ): Promise<void> {
    patchState({signedLanguage: language});
    dispatch(ChangeTranslation);
  }

  @Action(SetSpokenLanguageText)
  async setSpokenLanguageText(
    {patchState, getState, dispatch}: StateContext<TranslateStateModel>,
    {text}: SetSpokenLanguageText
  ): Promise<void> {
    const {spokenLanguage} = getState();
    patchState({
      spokenLanguageText: text,
      detectedLanguage: !text || spokenLanguage ? null : await this.service.detectSpokenLanguage(text),
    });

    dispatch(ChangeTranslation);
  }

  @Action(SetSignedLanguageVideo)
  async setSignedLanguageVideo(
    {patchState, dispatch}: StateContext<TranslateStateModel>,
    {url}: SetSignedLanguageVideo
  ): Promise<void> {
    patchState({signedLanguageVideo: url});
  }

  @Action(SetSignWritingText)
  async setSignWritingText(
    {patchState, dispatch}: StateContext<TranslateStateModel>,
    {text}: SetSignWritingText
  ): Promise<void> {
    // signNormalize only works after the SignWriting font is loaded
    font.cssLoaded(() => {
      const signWriting: string[] = text.map(sign => {
        const box = sign.startsWith('M') ? sign : 'M500x500' + sign;
        return signNormalize(box);
      });
      patchState({signWriting});
    });
  }

  @Action(ChangeTranslation, {cancelUncompleted: true})
  changeTranslation({getState, patchState, dispatch}: StateContext<TranslateStateModel>): Observable<any> {
    const {spokenToSigned, spokenLanguage, signedLanguage, detectedLanguage, spokenLanguageText} = getState();
    if (spokenToSigned) {
      patchState({signedLanguageVideo: null, signWriting: null}); // reset the signed language translation

      if (!spokenLanguageText) {
        patchState({signedLanguagePose: null, signWriting: []});
      } else {
        const actualSpokenLanguage = spokenLanguage || detectedLanguage;
        const path = this.service.translateSpokenToSigned(spokenLanguageText, actualSpokenLanguage, signedLanguage);
        patchState({signedLanguagePose: path});
        return this.service
          .translateSpokenToSignWriting(spokenLanguageText, actualSpokenLanguage, signedLanguage)
          .pipe(tap(signWriting => dispatch(new SetSignWritingText(signWriting))));
      }
    }

    return of();
  }

  @Action(UploadPoseFile)
  uploadPoseFile({getState, patchState}: StateContext<TranslateStateModel>, {url}: UploadPoseFile): void {
    const {spokenToSigned} = getState();
    if (spokenToSigned) {
      patchState({signedLanguagePose: url, signedLanguageVideo: initialState.signedLanguageVideo});
    }
  }

  @Action(CopySignedLanguageVideo)
  async copySignedLanguageVideo({getState}: StateContext<TranslateStateModel>): Promise<void> {
    const {signedLanguageVideo} = getState();

    const data = await fetch(signedLanguageVideo);
    const blob = await data.blob();
    try {
      const item = new ClipboardItem({[blob.type]: Promise.resolve(blob)});
      await navigator.clipboard.write([item]);
    } catch (e) {
      console.error(e);
      alert(`Copying "${blob.type}" on this device is not supported`);
    }
  }

  async shareNative(file: File) {
    const toBase64 = (file): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = error => reject(error);
      });

    // Save video to file system
    const {Directory, Filesystem} = await import('@capacitor/filesystem');
    const data = await toBase64(file);
    const fileOptions = {directory: Directory.Cache, path: 'video.mp4'};
    await Filesystem.writeFile({...fileOptions, data});
    const {uri} = await Filesystem.getUri(fileOptions);

    // Share video
    const {Share} = await import('@capacitor/share');
    await Share.share({url: uri});
  }

  async shareWeb(file: File) {
    if (!('share' in navigator)) {
      // For example in non-HTTPS on iOS
      alert(`Share functionality is not available`);
      return;
    }

    const files: File[] = [file];

    const url = window.location.href;
    const title = 'Signed Language Video for text';

    if ('canShare' in navigator && (navigator as any).canShare({files})) {
      // Apps like WhatsApp only support sharing a single item
      await navigator.share({files} as ShareData);
    } else {
      // TODO convert the video to GIF, try to share the GIF.
      await navigator.share({text: title, title, url});
    }
  }

  @Action(ShareSignedLanguageVideo)
  async shareSignedLanguageVideo({getState}: StateContext<TranslateStateModel>): Promise<void> {
    const {signedLanguageVideo} = getState();

    const data = await fetch(signedLanguageVideo);
    let blob = await data.blob();
    const ext = blob.type.split('/').pop();

    const file = new File([blob], 'video.' + ext, {type: blob.type});

    if (Capacitor.isNativePlatform()) {
      return this.shareNative(file);
    }

    return this.shareWeb(file);
  }

  @Action(DownloadSignedLanguageVideo)
  async downloadSignedLanguageVideo({getState}: StateContext<TranslateStateModel>): Promise<void> {
    const {signedLanguageVideo} = getState();

    const ext = signedLanguageVideo.split('.').pop();
    const downloadName = ['webm', 'mp4'].includes(ext) ? signedLanguageVideo : signedLanguageVideo + '.mp4';

    const a = document.createElement('a');
    a.href = signedLanguageVideo;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
