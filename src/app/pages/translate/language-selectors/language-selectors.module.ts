import {NgModule} from '@angular/core';
import {LanguageSelectorComponent} from '../language-selector/language-selector.component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FlagIconComponent} from '../../../components/flag-icon/flag-icon.component';
import {AppTranslocoModule} from '../../../core/modules/transloco/transloco.module';
import {NgxsModule} from '@ngxs/store';
import {TranslateState} from '../../../modules/translate/translate.state';
import {LanguageSelectorsComponent} from './language-selectors.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AppTranslocoModule,
    NgxsModule.forFeature([TranslateState]),
    MatTabsModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  declarations: [LanguageSelectorsComponent, LanguageSelectorComponent, FlagIconComponent],
  exports: [LanguageSelectorsComponent],
})
export class TranslateLanguageSelectorsModule {}
