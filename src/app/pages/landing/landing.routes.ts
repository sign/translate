import {Routes} from '@angular/router';
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
      {path: '', redirectTo: 'contribute', pathMatch: 'full'},
      {path: 'contribute', component: ContributeComponent},
      {path: 'terms', component: TermsComponent},
      {path: 'privacy', component: PrivacyComponent},
      {path: 'licenses', component: LicensesComponent},
    ],
  },
];
