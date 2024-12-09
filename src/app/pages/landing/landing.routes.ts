import {Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {ContributeComponent} from './contribute/contribute.component';
import {LandingComponent} from './landing.component';
import {LicensesComponent} from './licenses/licenses.component';
import {TermsComponent} from './terms/terms.component';
import {PrivacyComponent} from './privacy/privacy.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {path: '', component: AboutComponent},
      {path: 'about', redirectTo: ''},
      {path: 'contribute', component: ContributeComponent},
      {path: 'terms', component: TermsComponent},
      {path: 'privacy', component: PrivacyComponent},
      {path: 'licenses', component: LicensesComponent},
    ],
  },
];
