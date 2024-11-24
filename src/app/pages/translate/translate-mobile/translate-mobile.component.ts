import {Component, inject} from '@angular/core';
import {Store} from '@ngxs/store';
import {TranslateDesktopComponent} from '../translate-desktop/translate-desktop.component';
import {IonContent, IonFooter, IonHeader, IonToolbar} from '@ionic/angular/standalone';
import {SpokenLanguageInputComponent} from '../spoken-to-signed/spoken-language-input/spoken-language-input.component';
import {SignedLanguageOutputComponent} from '../spoken-to-signed/signed-language-output/signed-language-output.component';
import {SignedLanguageInputComponent} from '../signed-to-spoken/signed-language-input/signed-language-input.component';
import {VideoComponent} from '../../../components/video/video.component';
import {LanguageSelectorsComponent} from '../language-selectors/language-selectors.component';

@Component({
  selector: 'app-translate-mobile',
  templateUrl: './translate-mobile.component.html',
  styleUrls: ['./translate-mobile.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonFooter,
    SignedLanguageOutputComponent,
    SignedLanguageInputComponent,
    SpokenLanguageInputComponent,
    VideoComponent,
    LanguageSelectorsComponent,
  ],
})
export class TranslateMobileComponent extends TranslateDesktopComponent {}
