import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext} from '@ngxs/store';
import {ChangeTranslation, FlipTranslationDirection, SetInputMode, SetSignedLanguage, SetSpokenLanguage, SetSpokenLanguageText} from './translate.actions';
import {TranslationService} from './translate.service';
import {StartCamera, StopVideo} from '../../core/modules/ngxs/store/video/video.actions';

export type InputMode = 'webcam' | 'upload' | 'text';

export interface TranslateStateModel {
  spokenToSigned: boolean;
  inputMode: InputMode;

  spokenLanguage: string;
  signedLanguage: string;

  spokenLanguageText: string;
  signedLanguagePose: string;
}

const initialState: TranslateStateModel = {
  spokenToSigned: true,
  inputMode: 'text',

  spokenLanguage: 'en',
  signedLanguage: 'us',

  spokenLanguageText: 'Test',
  signedLanguagePose: null
};

@Injectable()
@State<TranslateStateModel>({
  name: 'translate',
  defaults: initialState
})
export class TranslateState implements NgxsOnInit {
  constructor(private service: TranslationService) {
  }

  ngxsOnInit({dispatch}: StateContext<TranslateStateModel>): any {
    dispatch(ChangeTranslation);
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

  @Action(ChangeTranslation)
  async changeTranslation({getState, patchState}: StateContext<TranslateStateModel>): Promise<void> {
    const {spokenToSigned, spokenLanguage, signedLanguage, spokenLanguageText} = getState();
    if (spokenToSigned) {
      if (!spokenLanguageText) {
        patchState({signedLanguagePose: null});
      } else {
        const path = this.service.translateSpokenToSigned(spokenLanguageText, spokenLanguage, signedLanguage);
        patchState({signedLanguagePose: path});
      }
    }
  }

}
