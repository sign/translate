import {Component, HostBinding, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {StartCamera, StopVideo} from '../../core/modules/ngxs/store/video/video.actions';
import {SetSetting} from '../../modules/settings/settings.actions';
import {Observable} from 'rxjs';
import {VideoStateModel} from '../../core/modules/ngxs/store/video/video.state';

type InputMode = 'webcam' | 'upload' | 'text';


const FAKE_WORDS = [
  {
    time: 0.618368,
    sw: ['M507x523S15a28494x496'],
    text: 'B'
  },
  {
    time: 0.876432,
    sw: ['M507x523S15a28494x496S26500493x477'],
    text: 'Your'
  },

  {
    time: 1.102468,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S115494'],
    text: 'Your h'
  },
  {
    time: 1.102468,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491'],
    text: 'Your h'
  },
  {
    time: 1.438297,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498'],
    text: 'Your'
  },
  {
    time: 1.628503,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20500489x476'],
    text: 'Your'
  },
  {
    time: 1.786967,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20600489x476'],
    text: 'Your name'
  },
  {
    time: 1.993408,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20600489x476', 'AS14c31S14c39S27102S27116S30300S30a00S36e00M554x585S30a00481x488S14c39465x545S14c31508x546'],
    text: 'Your name'
  },
  {
    time: 2.163386,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20600489x476', 'AS14c31S14c39S27102S27116S30300S30a00S36e00M554x585S30a00481x488S30300481x477S14c31508x546S14c39465x545S26506539x545S26512445x545'],
    text: 'Your name'
  },
  {
    time: 3.113322,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20600489x476', 'AS14c31S14c39S27102S27116S30300S30a00S36e00M554x585S30a00481x488S30300481x477S14c31508x546S14c39465x545S27102539x545S27116445x545'],
    text: 'What is your name?'
  },
];

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {

  @HostBinding('class.spoken-to-signed') spokenToSigned = false;

  @Select(state => state.video) videoState$: Observable<VideoStateModel>;

  inputMode: InputMode;

  signedLanguages = ['us', 'fr', 'es', 'sy', 'by', 'bg', 'fl', 'hr', 'cz', 'dk', 'in', 'nz', 'gb', 'ee', 'fi', 'at', 'de', 'cy', 'gr', 'is',
    'isl', 'it', 'jp', 'lv', 'lt', 'ir', 'pl', 'br', 'pt', 'ro', 'ru', 'sk', 'ar', 'cl', 'cu', 'mx', 'se', 'tr', 'ua', 'pk'];

  spokenLanguages = ['en', 'fr', 'es', 'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'zh-CN', 'zh-TW',
    'co', 'hr', 'cs', 'da', 'nl', 'eo', 'et', 'fi', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'he', 'hi', 'hmn', 'hu', 'is',
    'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt',
    'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ny', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk',
    'sl', 'so', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'];


  // This is bullshit for now
  translation = 'Translation';
  signWriting: string[] = [];

  constructor(private store: Store) {
    this.store.dispatch(new SetSetting('receiveVideo', true));
    this.setInputMode('upload');
  }

  ngOnInit(): void {

    // To get the fake translation
    const f = () => {
      this.translation = 'Translation';
      this.signWriting = ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20600489x476', 'AS14c31S14c39S27102S27116S30300S30a00S36e00M554x585S30a00481x488S30300481x477S14c31508x546S14c39465x545S27102539x545S27116445x545'];

      const video = document.querySelector('video');
      if (video) {
        for (const step of FAKE_WORDS) {
          if (step.time <= video.currentTime) {
            this.translation = step.text;
            this.signWriting = step.sw;
          }
        }
      }

      requestAnimationFrame(f);
    };
    f();
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

