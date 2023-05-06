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
import {TranslateLanguageSelectorModule} from './language-selector/language-selector.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgxsModule} from '@ngxs/store';
import {TranslateState} from '../../modules/translate/translate.state';
import {MatDialogModule} from '@angular/material/dialog';
import {NtkmeButtonModule} from '@ctrl/ngx-github-buttons';

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
  TranslateLanguageSelectorModule,
];

const components = [SendFeedbackComponent, TranslateInputButtonComponent, TranslateComponent];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AppTranslocoModule,
    NgxsModule.forFeature([TranslateState]),
    MatTooltipModule,
    MatDialogModule,
    RouterModule.forChild(routes),

    NtkmeButtonModule,
    ...componentModules,
  ],
  declarations: components,
})
export class TranslatePageModule {}
