import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlaygroundComponent} from './pages/playground/playground.component';
import {TranslateComponent} from './pages/translate/translate.component';

const routes: Routes = [
  {path: '', component: TranslateComponent},
  {path: 'playground', component: PlaygroundComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
