import {Routes} from '@angular/router';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {TranslateComponent} from './pages/translate/translate.component';
import {provideStates} from '@ngxs/store';
import {TranslateState} from './modules/translate/translate.state';
import {LanguageDetectionService} from './modules/translate/language-detection/language-detection.service';
import {MediaPipeLanguageDetectionService} from './modules/translate/language-detection/mediapipe.service';

export const routes: Routes = [
  {
    path: '',
    component: TranslateComponent,
    providers: [
      provideStates([TranslateState]),
      {provide: LanguageDetectionService, useClass: MediaPipeLanguageDetectionService},
    ],
  },
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
