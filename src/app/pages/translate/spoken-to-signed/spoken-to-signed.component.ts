import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-spoken-to-signed',
  templateUrl: './spoken-to-signed.component.html',
  styleUrls: ['./spoken-to-signed.component.scss'],
})
export class SpokenToSignedComponent {
  signWriting$!: Observable<string[]>;

  constructor(private store: Store) {
    this.signWriting$ = this.store.select<string[]>(state => state.translate.signWriting);
  }
}
