import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule} from '@angular/router';
import {TranslateComponent} from './translate.component';
import {LazyDialogEntryComponent} from './dialog-entry.component';
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
import {AppNgxsModule, ngxsConfig} from '../../core/modules/ngxs/ngxs.module';
import {SettingsState} from '../../modules/settings/settings.state';
import {DetectorState} from '../../modules/detector/detector.state';

const routes = [
  {
    path: '',
    component: TranslateComponent,
  },
  {
    path: 'settings',
    outlet: 'dialog',
    component: LazyDialogEntryComponent,
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
    RouterModule.forChild(routes),
    ...componentModules,
  ],
  declarations: components,
})
export class TranslatePageModule {}
