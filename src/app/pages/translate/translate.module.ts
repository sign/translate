import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule} from '@angular/router';
import {TranslateComponent} from './translate.component';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {SpokenToSignedModule} from './spoken-to-signed/spoken-to-signed.module';
import {SendFeedbackComponent} from './send-feedback/send-feedback.component';
import {SignedToSpokenModule} from './signed-to-spoken/signed-to-spoken.module';
import {TranslateInputButtonComponent} from './input/button/button.component';
import {DropPoseFileModule} from './drop-pose-file/drop-pose-file.module';
import {TranslateLanguageSelectorsModule} from './language-selectors/language-selectors.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgxsModule} from '@ngxs/store';
import {TranslateState} from '../../modules/translate/translate.state';
import {NtkmeButtonModule} from '@ctrl/ngx-github-buttons';
import {TranslateDesktopComponent} from './translate-desktop/translate-desktop.component';
import {TranslateMobileComponent} from './translate-mobile/translate-mobile.component';

const routes = [
  {
    path: '',
    component: TranslateComponent,
  },
];

const componentModules = [
  SpokenToSignedModule,
  SignedToSpokenModule,
  DropPoseFileModule,
  TranslateLanguageSelectorsModule,
];

const components = [
  SendFeedbackComponent,
  TranslateInputButtonComponent,
  TranslateComponent,
  TranslateDesktopComponent,
  TranslateMobileComponent,
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AppTranslocoModule,
    NgxsModule.forFeature([TranslateState]),
    MatTooltipModule,
    RouterModule.forChild(routes),

    NtkmeButtonModule,
    ...componentModules,
  ],
  declarations: components,
})
export class TranslatePageModule {}
