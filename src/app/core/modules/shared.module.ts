import {NgModule} from '@angular/core';
import {AppAngularMaterialModule} from './angular-material/angular-material.module';
import {AppNgxsModule} from './ngxs/ngxs.module';
import {AppTranslocoModule} from './transloco/transloco.module';
import {CommonModule} from '@angular/common';
import {TensorflowService} from '../services/tfjs.service';

const components = [];

const modules = [
  AppNgxsModule,
  AppTranslocoModule,
  AppAngularMaterialModule,
  CommonModule,
];

@NgModule({
  declarations: components,
  imports: modules,
  exports: [
    ...components,
    ...modules
  ],
  providers: [
    TensorflowService
  ]
})
export class AppSharedModule {
}
