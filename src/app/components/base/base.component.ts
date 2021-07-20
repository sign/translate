import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-base',
  template: ``,
  styles: []
})
export abstract class BaseComponent implements OnDestroy {
  ngUnsubscribe: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
