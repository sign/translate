import {Component, HostBinding} from '@angular/core';

type InputMode = 'webcam' | 'upload' | 'text';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent {

  @HostBinding('class.spoken-to-signed') spokenToSigned = false;

  inputMode: InputMode = 'webcam';

  signedLanguage = 'us';
  topSignedLanguage: string[] = ['us', 'fr', 'de'];

  setInputMode(inputMode: InputMode): void {
    this.inputMode = inputMode;
  }

  flipDirection(): void {
    this.spokenToSigned = !this.spokenToSigned;
    this.inputMode = this.spokenToSigned ? 'text' : 'webcam';
  }

}
