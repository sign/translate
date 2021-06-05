import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlaygroundComponent} from './pages/playground/playground.component';
import {TranslateComponent} from './pages/translate/translate.component';

const routes: Routes = [
  {path: '', component: PlaygroundComponent},
  {path: 'translate', component: TranslateComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
