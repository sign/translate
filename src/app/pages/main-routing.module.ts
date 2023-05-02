import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./translate/translate.module').then(m => m.TranslatePageModule),
      },
      // {
      //   path: 'converse',
      //   loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule),
      // },
      // {
      //   path: 'avatars',
      //   loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule),
      // },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule),
      },
      {path: 'translate', pathMatch: 'full', redirectTo: ''},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MainRoutingModule {}
