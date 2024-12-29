import {Component, inject, Input} from '@angular/core';
import {InputMode} from '../../../../modules/translate/translate.state';
import {Store} from '@ngxs/store';
import {SetInputMode} from '../../../../modules/translate/translate.actions';
import {Observable} from 'rxjs';
import {IonButton, IonIcon} from '@ionic/angular/standalone';
import {TranslocoPipe} from '@jsverse/transloco';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-translate-input-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [IonButton, IonIcon, TranslocoPipe, AsyncPipe],
})
export class TranslateInputButtonComponent {
  private store = inject(Store);

  inputMode$!: Observable<InputMode>;

  @Input() mode: InputMode;
  @Input() icon: string;

  constructor() {
    this.inputMode$ = this.store.select<InputMode>(state => state.translate.inputMode);
  }

  setInputMode(): void {
    this.store.dispatch(new SetInputMode(this.mode));
  }
}
