import {NgModule} from '@angular/core';
import {PlaygroundComponent} from './playground.component';
import {IonicModule} from '@ionic/angular';
import {SettingsModule} from '../../modules/settings/settings.module';
import {VideoModule} from '../../components/video/video.module';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../modules/settings/settings.state';

const routes = [
  {
    path: '',
    component: PlaygroundComponent,
  },
];

@NgModule({
  imports: [
    AppTranslocoModule,
    NgxsModule.forFeature([SettingsState]),
    IonicModule,
    SettingsModule,
    VideoModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PlaygroundComponent],
})
export class PlaygroundPageModule {}
