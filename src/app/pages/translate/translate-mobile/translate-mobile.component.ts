import {Component} from '@angular/core';
import {TranslateDesktopComponent} from '../translate-desktop/translate-desktop.component';
import {IonContent, IonFooter, IonHeader, IonToolbar} from '@ionic/angular/standalone';
import {SignedLanguageInputComponent} from '../signed-to-spoken/signed-language-input/signed-language-input.component';
import {LanguageSelectorsComponent} from '../language-selectors/language-selectors.component';
import {VideoModule} from '../../../components/video/video.module';

@Component({
  selector: 'app-translate-mobile',
  templateUrl: './translate-mobile.component.html',
  styleUrls: ['./translate-mobile.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonFooter,
    SignedLanguageInputComponent,
    VideoModule,
    LanguageSelectorsComponent,
  ],
})
export class TranslateMobileComponent extends TranslateDesktopComponent {}
