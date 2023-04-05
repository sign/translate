import {NgModule} from '@angular/core';
import {PlaygroundComponent} from './playground.component';
import {IonicModule} from '@ionic/angular';
import {SettingsModule} from '../../modules/settings/settings.module';
import {VideoModule} from '../../components/video/video.module';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {RouterModule} from '@angular/router';
import {AppNgxsModule} from '../../core/modules/ngxs/ngxs.module';

const routes = [
  {
    path: '',
    component: PlaygroundComponent,
  },
];

@NgModule({
  imports: [AppTranslocoModule, AppNgxsModule, IonicModule, SettingsModule, VideoModule, RouterModule.forChild(routes)],
  declarations: [PlaygroundComponent],
})
export class PlaygroundPageModule {}
