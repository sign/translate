import {Component, Input} from '@angular/core';
import {InputMode} from '../../../../modules/translate/translate.state';
import {Store} from '@ngxs/store';
import {SetInputMode} from '../../../../modules/translate/translate.actions';
import {Observable} from 'rxjs';
import {addIcons} from 'ionicons';
import {IonButton, IonIcon} from '@ionic/angular/standalone';
import {TranslocoPipe} from '@ngneat/transloco';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-translate-input-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, TranslocoPipe, AsyncPipe],
})
export class TranslateInputButtonComponent {
  inputMode$!: Observable<InputMode>;

  @Input() mode: InputMode;
  @Input() icon: string;

  constructor(private store: Store) {
    this.inputMode$ = this.store.select<InputMode>(state => state.translate.inputMode);

    addIcons({[this.icon]: this.icon});
  }

  setInputMode(): void {
    this.store.dispatch(new SetInputMode(this.mode));
  }
}
