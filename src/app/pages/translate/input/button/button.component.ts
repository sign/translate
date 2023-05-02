import {Component, Input} from '@angular/core';
import {InputMode} from '../../../../modules/translate/translate.state';
import {Store} from '@ngxs/store';
import {SetInputMode} from '../../../../modules/translate/translate.actions';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-translate-input-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class TranslateInputButtonComponent {
  inputMode$!: Observable<InputMode>;

  @Input() mode: InputMode;
  @Input() icon: string;

  constructor(private store: Store) {
    this.inputMode$ = this.store.select<InputMode>(state => state.translate.inputMode);
  }

  setInputMode(): void {
    this.store.dispatch(new SetInputMode(this.mode));
  }
}
