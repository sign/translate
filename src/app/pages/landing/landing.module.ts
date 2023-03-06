import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingComponent} from './landing.component';
import {AboutComponent} from './about/about.component';
import {LanguagesComponent} from './languages/languages.component';
import {ContributeComponent} from './contribute/contribute.component';
import {ToolsComponent} from './tools/tools.component';
import {AppAngularMaterialModule} from '../../core/modules/angular-material/angular-material.module';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {LandingRoutingModule} from './landing-routing.module';
import {LanguageSelectorComponent} from '../../components/language-selector/language-selector.component';
import {StoresComponent} from '../../components/stores/stores.component';
import {AboutHeroComponent} from './about/about-hero/about-hero.component';
import {AboutDirectionComponent} from './about/about-direction/about-direction.component';
import {AboutOfflineComponent} from './about/about-offline/about-offline.component';
import {AboutAppearanceComponent} from './about/about-appearance/about-appearance.component';
import {LazyMapComponent} from './languages/lazy-map/lazy-map.component';
import {LicensesComponent} from './licenses/licenses.component';
import {MatTreeModule} from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import {AboutBenefitsComponent} from './about/about-benefits/about-benefits.component';
import {AboutTeamComponent} from './about/about-team/about-team.component';
import {AboutPricingComponent} from './about/about-pricing/about-pricing.component';
import {AboutCustomersComponent} from './about/about-customers/about-customers.component';
import {AboutFaqComponent} from './about/about-faq/about-faq.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {AboutObjectivesComponent} from './about/about-objectives/about-objectives.component';
import {AboutApiComponent} from './about/about-api/about-api.component';
import {BusinessComponent} from './business/business.component';
import {SettingsPageModule} from '../settings/settings.module';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
    LandingComponent,
    AboutComponent,
    LanguagesComponent,
    ContributeComponent,
    ToolsComponent,
    LanguageSelectorComponent,
    StoresComponent,
    AboutHeroComponent,
    AboutDirectionComponent,
    AboutOfflineComponent,
    AboutAppearanceComponent,
    LazyMapComponent,
    LicensesComponent,
    AboutBenefitsComponent,
    AboutTeamComponent,
    AboutPricingComponent,
    AboutCustomersComponent,
    AboutFaqComponent,
    AboutObjectivesComponent,
    AboutApiComponent,
    BusinessComponent,
  ],
  imports: [
    CommonModule,
    AppAngularMaterialModule,
    AppTranslocoModule,
    LandingRoutingModule,
    MatTreeModule,
    CdkTreeModule,
    MatExpansionModule,
    SettingsPageModule,
    IonicModule,
  ],
  bootstrap: [LandingComponent],
})
export class LandingModule {}
