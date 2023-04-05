import {NgModule} from '@angular/core';
import {LanguageSelectorComponent} from './language-selector.component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FlagIconComponent} from '../../../components/flag-icon/flag-icon.component';
import {AppTranslocoModule} from '../../../core/modules/transloco/transloco.module';
import {AppNgxsModule} from '../../../core/modules/ngxs/ngxs.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AppTranslocoModule,
    AppNgxsModule,
    MatTabsModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  declarations: [LanguageSelectorComponent, FlagIconComponent],
  exports: [LanguageSelectorComponent],
})
export class TranslateLanguageSelectorModule {}
