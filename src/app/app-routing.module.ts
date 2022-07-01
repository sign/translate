import {NgModule} from '@angular/core';
import {InitialNavigation, RouterModule, Routes} from '@angular/router';
import {PlaygroundComponent} from './pages/playground/playground.component';
import {TranslateComponent} from './pages/translate/translate.component';
import {BenchmarkComponent} from './pages/benchmark/benchmark.component';
import {environment} from '../environments/environment';

const routes: Routes = [
  {path: '', component: TranslateComponent},
  {path: 'playground', component: PlaygroundComponent},
  {path: 'benchmark', component: BenchmarkComponent},
  {path: 'about', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: environment.initialNavigation,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
