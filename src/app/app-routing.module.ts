import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {PlaygroundComponent} from './pages/playground/playground.component';
import {TranslateComponent} from './pages/translate/translate.component';
import {BenchmarkComponent} from './pages/benchmark/benchmark.component';
import {environment} from '../environments/environment';
import {LazyDialogEntryComponent} from './pages/translate/dialog-entry.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: TranslateComponent,
    children: [
      {
        path: 'settings',
        outlet: 'dialog',
        component: LazyDialogEntryComponent,
      },
    ],
  },
  {path: 'tabs', loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)},
  {path: 'playground', component: PlaygroundComponent},
  {path: 'benchmark', component: BenchmarkComponent},
  {path: 'about', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)},
  {path: 'legal', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)},
  {
    path: 's', // to prevent the settings from loading on page load, adding one level of route (i.e. s/offline)
    outlet: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
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
