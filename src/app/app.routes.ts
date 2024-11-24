import {Routes} from '@angular/router';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {provideStates} from '@ngxs/store';
import {TranslateState} from './modules/translate/translate.state';
import {LanguageDetectionService} from './modules/translate/language-detection/language-detection.service';
import {MediaPipeLanguageDetectionService} from './modules/translate/language-detection/mediapipe.service';
import {MainComponent} from './pages/main.component';
import {SignWritingState} from './modules/sign-writing/sign-writing.state';
import {PoseState} from './modules/pose/pose.state';
import {VideoState} from './core/modules/ngxs/store/video/video.state';
import {DetectorState} from './modules/detector/detector.state';

export const routes: Routes = [
  {
    path: 'playground',
    loadComponent: () => import('./pages/playground/playground.component').then(m => m.PlaygroundComponent),
    providers: [provideStates([VideoState, PoseState, SignWritingState, DetectorState])],
  },
  {
    path: 'benchmark',
    loadComponent: () => import('./pages/benchmark/benchmark.component').then(m => m.BenchmarkComponent),
    providers: [{provide: LanguageDetectionService, useClass: MediaPipeLanguageDetectionService}],
  },
  {path: 'about', loadChildren: () => import('./pages/landing/landing.routes').then(m => m.routes)},
  {path: 'legal', loadChildren: () => import('./pages/landing/landing.routes').then(m => m.routes)},
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/translate/translate.component').then(m => m.TranslateComponent),
        providers: [
          provideStates([TranslateState, VideoState, PoseState, SignWritingState, DetectorState]),
          {provide: LanguageDetectionService, useClass: MediaPipeLanguageDetectionService},
        ],
      },
      {
        path: 'translate',
        redirectTo: '',
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
  {path: '**', component: NotFoundComponent},
];
