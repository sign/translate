import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BaseComponent} from '../../../components/base/base.component';
import {debounce, filter, takeUntil, tap} from 'rxjs/operators';
import {interval} from 'rxjs';

@Component({
  selector: 'app-spoken-to-signed',
  templateUrl: './spoken-to-signed.component.html',
  styleUrls: ['./spoken-to-signed.component.scss']
})
export class SpokenToSignedComponent extends BaseComponent implements OnInit {

  text = new FormControl('what is your name?');
  maxTextLength = 500;

  // signWriting = [];
  signWriting = ['M507x523S15a28494x496S26500493x477', 'M522x525S11541498x491S11549479x498S20600489x476', 'AS14c31S14c39S27102S27116S30300S30a00S36e00M554x585S30a00481x488S30300481x477S14c31508x546S14c39465x545S27102539x545S27116445x545'];

  pose: string;

  ngOnInit(): void {
    this.text.valueChanges.pipe(
      debounce(() => interval(500)),
      tap((text) => {
        if (text) {
          this.pose = 'https://nlp.biu.ac.il/~ccohenya8/sign/sentence/?lang=en.us&sentence=' + encodeURIComponent(text);
        } else {
          this.pose = null;
        }
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

}
