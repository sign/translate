import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TabsPageRoutingModule} from './tabs-routing.module';

import {TabsPageComponent} from './tabs.page';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';

@NgModule({
  imports: [IonicModule, CommonModule, TabsPageRoutingModule, MatIconModule, AppTranslocoModule, RouterModule],
  declarations: [TabsPageComponent],
})
export class TabsPageModule {}
