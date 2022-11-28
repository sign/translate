import {Component, Input} from '@angular/core';
import {InputMode} from '../../../../modules/translate/translate.state';
import {Store} from '@ngxs/store';
import {SetInputMode} from '../../../../modules/translate/translate.actions';

@Component({
  selector: 'app-translate-input-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class TranslateInputButtonComponent {
  inputMode$ = this.store.select<InputMode>(state => state.translate.inputMode);

  @Input() mode: InputMode;
  @Input() icon: string;

  constructor(private store: Store) {}

  setInputMode(): void {
    this.store.dispatch(new SetInputMode(this.mode));
  }
}
