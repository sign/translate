import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment';

const routes: Routes = [
  {path: '', loadChildren: () => import('./pages/translate/translate.module').then(m => m.TranslatePageModule)},
  {path: 'tabs', loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)},
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
    path: 's', // to prevent the settings from loading on page load, adding one level of route (i.e. s/offline)
    outlet: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: environment.initialNavigation,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
