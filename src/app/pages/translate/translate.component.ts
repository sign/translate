import {Component, HostBinding} from '@angular/core';
import {Store} from '@ngxs/store';
import {StartCamera, StopVideo} from '../../core/modules/ngxs/store/video/video.actions';
import {SetSetting} from '../../modules/settings/settings.actions';

export type InputMode = 'webcam' | 'upload' | 'text';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent {

  @HostBinding('class.spoken-to-signed') spokenToSigned = true;

  inputMode: InputMode;

  signedLanguages = ['us', 'fr', 'es', 'sy', 'by', 'bg', 'fl', 'hr', 'cz', 'dk', 'in', 'nz', 'gb', 'ee', 'fi', 'at', 'de', 'cy', 'gr', 'is',
    'isl', 'it', 'jp', 'lv', 'lt', 'ir', 'pl', 'br', 'pt', 'ro', 'ru', 'sk', 'ar', 'cl', 'cu', 'mx', 'se', 'tr', 'ua', 'pk'];

  spokenLanguages = ['en', 'fr', 'es', 'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'zh-CN', 'zh-TW',
    'co', 'hr', 'cs', 'da', 'nl', 'eo', 'et', 'fi', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'he', 'hi', 'hmn', 'hu', 'is',
    'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt',
    'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ny', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk',
    'sl', 'so', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'];


  constructor(private store: Store) {
    document.title = 'Sign Translate'; // Set page title
    // Default settings
    this.store.dispatch([
      new SetSetting('receiveVideo', true),
      new SetSetting('detectSign', false),
      new SetSetting('drawPose', true),
    ]);
    this.setInputMode('text');
  }

  setInputMode(inputMode: InputMode): void {
    if (this.inputMode === inputMode) {
      return;
    }
    this.inputMode = inputMode;

    this.store.dispatch(StopVideo);
    if (inputMode === 'webcam') {
      this.store.dispatch(StartCamera);
    }
  }

  swapLanguages(): void {
    this.spokenToSigned = !this.spokenToSigned;
    this.setInputMode(this.spokenToSigned ? 'text' : 'webcam');
  }
}

