import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';

const materialModules = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatTooltipModule,
  MatSidenavModule,
  MatListModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatCardModule,
  MatDialogModule,
];

@NgModule({
  imports: materialModules,
  exports: materialModules,
})
export class AppAngularMaterialModule {}
