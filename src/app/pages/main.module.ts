import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {MainRoutingModule} from './main-routing.module';
import {IonLabel, IonIcon, IonTabButton, IonTabBar, IonTabs} from '@ionic/angular/standalone';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, IonLabel, IonIcon, IonTabButton, IonTabBar, IonTabs, MainRoutingModule],
})
export class MainPageModule {}
