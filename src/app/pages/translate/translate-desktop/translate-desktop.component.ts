import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../components/base/base.component';

@Component({
  selector: 'app-translate-desktop',
  templateUrl: './translate-desktop.component.html',
  styleUrls: ['./translate-desktop.component.scss'],
})
export class TranslateDesktopComponent extends BaseComponent implements OnInit {
  spokenToSigned$: Observable<boolean>;
  spokenToSigned: boolean;

  constructor(private store: Store) {
    super();

    this.spokenToSigned$ = this.store.select<boolean>(state => state.translate.spokenToSigned);
  }

  ngOnInit(): void {
    this.spokenToSigned$
      .pipe(
        tap(spokenToSigned => (this.spokenToSigned = spokenToSigned)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
