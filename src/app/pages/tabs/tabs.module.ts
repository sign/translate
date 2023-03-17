import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TabsPageRoutingModule} from './tabs-routing.module';

import {TabsPageComponent} from './tabs.page';
import {MatIconModule} from '@angular/material/icon';
import {TranslocoModule} from '@ngneat/transloco';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [IonicModule, CommonModule, TabsPageRoutingModule, MatIconModule, TranslocoModule, RouterModule],
  declarations: [TabsPageComponent],
})
export class TabsPageModule {}
