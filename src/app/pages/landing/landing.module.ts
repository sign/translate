import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingComponent} from './landing.component';
import {AboutComponent} from './about/about.component';
import {LanguagesComponent} from './languages/languages.component';
import {ContributeComponent} from './contribute/contribute.component';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {LandingRoutingModule} from './landing-routing.module';
import {StoresComponent} from '../../components/stores/stores.component';
import {AboutHeroComponent} from './about/about-hero/about-hero.component';
import {AboutDirectionComponent} from './about/about-direction/about-direction.component';
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
import {SettingsPageModule} from '../settings/settings.module';
import {IonicModule} from '@ionic/angular';
import {I18NLanguageSelectorComponent} from '../../components/i18n-language-selector/i18n-language-selector.component';
import {TermsComponent} from './terms/terms.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MermaidChartComponent} from './mermaid-chart/mermaid-chart.component';
import {LandingFooterComponent} from './landing-footer/landing-footer.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    LandingComponent,
    AboutComponent,
    LanguagesComponent,
    ContributeComponent,
    I18NLanguageSelectorComponent,
    StoresComponent,
    AboutHeroComponent,
    AboutDirectionComponent,
    AboutAppearanceComponent,
    LazyMapComponent,
    LicensesComponent,
    LandingFooterComponent,
    AboutBenefitsComponent,
    AboutTeamComponent,
    AboutPricingComponent,
    AboutCustomersComponent,
    AboutFaqComponent,
    AboutObjectivesComponent,
    AboutApiComponent,
    TermsComponent,
    PrivacyComponent,
  ],
  imports: [
    CommonModule,
    AppTranslocoModule,
    LandingRoutingModule,
    MatTreeModule,
    CdkTreeModule,
    MatExpansionModule,
    SettingsPageModule,
    IonicModule,
    MermaidChartComponent,
    ReactiveFormsModule,
  ],
  bootstrap: [LandingComponent],
  exports: [I18NLanguageSelectorComponent],
})
export class LandingModule {}
