import {Component} from '@angular/core';
import {Store} from '@ngxs/store';
import {TranslateDesktopComponent} from '../translate-desktop/translate-desktop.component';

@Component({
  selector: 'app-translate-mobile',
  templateUrl: './translate-mobile.component.html',
  styleUrls: ['./translate-mobile.component.scss'],
})
export class TranslateMobileComponent extends TranslateDesktopComponent {
  constructor(store: Store) {
    super(store);
  }
}
