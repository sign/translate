import {InputMode} from './translate.state';

export class FlipTranslationDirection {
  static readonly type = '[Translate] Flip Translation Direction';
}

export class SetInputMode {
  static readonly type = '[Translate] Set Input Mode';

  constructor(public mode: InputMode) {
  }
}


export class SetSpokenLanguage {
  static readonly type = '[Translate] Set Spoken Language';

  constructor(public language: string) {
  }
}

export class SetSignedLanguage {
  static readonly type = '[Translate] Set Signed Language';

  constructor(public language: string) {
  }
}

export class SetSpokenLanguageText {
  static readonly type = '[Translate] Set Spoken Language Text';

  constructor(public text: string) {
  }
}


export class ChangeTranslation {
  static readonly type = '[Translate] Change Translation';
}
