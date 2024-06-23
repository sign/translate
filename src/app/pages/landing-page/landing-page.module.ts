import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LandingPageComponent} from './landing-page.component';

const routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MatTooltipModule, RouterModule.forChild(routes)],
  declarations: [LandingPageComponent],
})
export class LandingPageModule {}
