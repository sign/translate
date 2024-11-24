import {Routes} from '@angular/router';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {provideStates} from '@ngxs/store';
import {TranslateState} from './modules/translate/translate.state';
import {LanguageDetectionService} from './modules/translate/language-detection/language-detection.service';
import {MediaPipeLanguageDetectionService} from './modules/translate/language-detection/mediapipe.service';
import {MainComponent} from './pages/main.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/translate/translate.component').then(m => m.TranslateComponent),
        providers: [
          provideStates([TranslateState]),
          {provide: LanguageDetectionService, useClass: MediaPipeLanguageDetectionService},
        ],
      },
      // {
      //   path: 'converse',
      //   loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule),
      // },
      // {
      //   path: 'avatars',
      //   loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule),
      // },
      // {
      //   path: 'settings',
      //   loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule),
      // },
    ],
  },
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
