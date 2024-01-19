import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {SignWritingObj} from '../../../modules/translate/translate.state';

@Component({
  selector: 'app-spoken-to-signed',
  templateUrl: './spoken-to-signed.component.html',
  styleUrls: ['./spoken-to-signed.component.scss'],
})
export class SpokenToSignedComponent {
  signWriting$!: Observable<SignWritingObj[]>;

  constructor(private store: Store) {
    this.signWriting$ = this.store.select<SignWritingObj[]>(state => state.translate.signWriting);
  }
}
