import {NgModule} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const materialModules = [
  MatTooltipModule, // Ionic does not have tooltips
  MatProgressSpinnerModule, // Ionic does not have a spinner with "progress"
  MatTabsModule, // Unclear how to implement scrolling tabs in Ionic
  MatMenuModule, // Ionic does have "Popover", but the implementation is not comfortable to work with
];

@NgModule({
  imports: materialModules,
  exports: materialModules,
})
export class AppAngularMaterialModule {}
