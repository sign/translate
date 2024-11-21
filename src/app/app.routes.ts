import {Routes} from '@angular/router';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {TranslateComponent} from './pages/translate/translate.component';

export const routes: Routes = [
  {path: '', component: TranslateComponent},
  // {path: '', loadChildren: () => import('./pages/main.module').then(m => m.MainPageModule)},
  // {
  //   path: 'playground',
  //   loadChildren: () => import('./pages/playground/playground.module').then(m => m.PlaygroundPageModule),
  // },
  // {
  //   path: 'benchmark',
  //   loadChildren: () => import('./pages/benchmark/benchmark.module').then(m => m.BenchmarkPageModule),
  // },
  // {path: 'about', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)},
  // {path: 'legal', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)},
  {path: '**', component: NotFoundComponent},
];
