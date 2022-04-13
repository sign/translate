import {Component, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {VideoStateModel} from '../../../core/modules/ngxs/store/video/video.state';
import {InputMode} from '../../../modules/translate/translate.state';
import {SetSignWritingText} from '../../../modules/translate/translate.actions';

const FAKE_WORDS = [
  {
    time: 0.618368,
    sw: ['M507x523S15a28494x496'],
    text: 'B',
  },
  {
    time: 0.876432,
    sw: ['M507x523S15a28494x496S26500493x477'],
    text: 'Your',
  },

  {
    time: 1.102468,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S115494'],
    text: 'Your h',
  },
  {
    time: 1.102468,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491'],
    text: 'Your h',
  },
  {
    time: 1.438297,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498'],
    text: 'Your',
  },
  {
    time: 1.628503,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20500489x476'],
    text: 'Your',
  },
  {
    time: 1.786967,
    sw: ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20600489x476'],
    text: 'Your name',
  },
  {
    time: 1.993408,
    sw: [
      'M507x523S15a28494x496S26500493x477',
      'M522x525S11541498x491S11549479x498S20600489x476',
      'AS14c31S14c39S27102S27116S30300S30a00S36e00M554x585S30a00481x488S14c39465x545S14c31508x546',
    ],
    text: 'Your name',
  },
  {
    time: 2.163386,
    sw: [
      'M507x523S15a28494x496S26500493x477',
      'M522x525S11541498x491S11549479x498S20600489x476',
      'AS14c31S14c39S27102S27116S30300S30a00S36e00M554x585S30a00481x488S30300481x477S14c31508x546S14c39465x545S26506539x545S26512445x545',
    ],
    text: 'Your name',
  },
  {
    time: 3.113322,
    sw: [
      'M507x523S15a28494x496S26500493x477',
      'M522x525S11541498x491S11549479x498S20600489x476',
      'AS14c31S14c39S27102S27116S30300S30a00S36e00M554x585S30a00481x488S30300481x477S14c31508x546S14c39465x545S27102539x545S27116445x545',
    ],
    text: 'What is your name?',
  },
];

@Component({
  selector: 'app-signed-to-spoken',
  templateUrl: './signed-to-spoken.component.html',
  styleUrls: ['./signed-to-spoken.component.scss'],
})
export class SignedToSpokenComponent implements OnInit {
  @Select(state => state.video) videoState$: Observable<VideoStateModel>;
  @Select(state => state.translate.inputMode) inputMode$: Observable<InputMode>;
  @Select(state => state.translate.spokenLanguage) spokenLanguage$: Observable<string>;
  @Select(state => state.translate.signWriting) signWriting$: Observable<string[]>;

  // This is bullshit for now
  translation = 'Translation';

  constructor(private store: Store) {}

  ngOnInit(): void {
    // To get the fake translation
    const f = () => {
      this.translation = 'Translation';

      const video = document.querySelector('video');
      if (video) {
        for (const step of FAKE_WORDS) {
          if (step.time <= video.currentTime) {
            this.translation = step.text;
            this.store.dispatch(new SetSignWritingText(step.sw));
          }
        }
      }

      requestAnimationFrame(f);
    };
    f();
  }
}
