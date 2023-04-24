import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {IonicModule} from '@ionic/angular';
import {MainRoutingModule} from './main-routing.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, IonicModule, MainRoutingModule],
})
export class MainPageModule {}
