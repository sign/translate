import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BaseComponent} from '../../../components/base/base.component';
import {debounce, takeUntil, tap} from 'rxjs/operators';
import {interval} from 'rxjs';

@Component({
  selector: 'app-spoken-to-signed',
  templateUrl: './spoken-to-signed.component.html',
  styleUrls: ['./spoken-to-signed.component.scss']
})
export class SpokenToSignedComponent extends BaseComponent implements OnInit {

  text = new FormControl();
  signWriting = [];

  pose: string;

  ngOnInit(): void {
    this.text.valueChanges.pipe(
      debounce(() => interval(500)),
      tap((text) => {
        console.log('text', text);
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
