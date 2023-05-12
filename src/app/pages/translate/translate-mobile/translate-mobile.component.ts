import {Component} from '@angular/core';
import {SetSpokenLanguageText} from '../../../modules/translate/translate.actions';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-translate-mobile',
  templateUrl: './translate-mobile.component.html',
  styleUrls: ['./translate-mobile.component.scss'],
})
export class TranslateMobileComponent {
  constructor(private store: Store) {}

  setSpokenLanguageText(event: Event): void {
    const text = (event.target as any).value;
    this.store.dispatch(new SetSpokenLanguageText(text));
  }
}
