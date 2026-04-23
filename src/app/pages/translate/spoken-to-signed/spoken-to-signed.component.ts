import {Component, inject} from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {SpokenLanguageInputComponent} from './spoken-language-input/spoken-language-input.component';
import {SignWritingComponent} from '../signwriting/sign-writing.component';
import {SignedLanguageOutputComponent} from './signed-language-output/signed-language-output.component';

@Component({
  selector: 'app-spoken-to-signed',
  templateUrl: './spoken-to-signed.component.html',
  styleUrls: ['./spoken-to-signed.component.scss'],
  imports: [SpokenLanguageInputComponent, SignWritingComponent, SignedLanguageOutputComponent, AsyncPipe],
})
export class SpokenToSignedComponent {
  private store = inject(Store);
  drawSignWriting$: Observable<boolean> = this.store.select<boolean>(state => state.settings.drawSignWriting);
}
