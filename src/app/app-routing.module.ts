import {NgModule} from '@angular/core';
import {NoPreloading, RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment';

const routes: Routes = [
  // {path: '', loadChildren: () => import('./pages/translate/translate.module').then(m => m.TranslatePageModule)},
  {path: '', loadChildren: () => import('./pages/main.module').then(m => m.MainPageModule)},
  {
    path: 'playground',
    loadChildren: () => import('./pages/playground/playground.module').then(m => m.PlaygroundPageModule),
  },
  {
    path: 'benchmark',
    loadChildren: () => import('./pages/benchmark/benchmark.module').then(m => m.BenchmarkPageModule),
  },
  {path: 'about', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)},
  {path: 'legal', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)},
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: environment.initialNavigation,
      preloadingStrategy: NoPreloading,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
