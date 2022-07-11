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
import {AboutSharingComponent} from './about/about-sharing/about-sharing.component';
import {LazyMapComponent} from './languages/lazy-map/lazy-map.component';

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
    AboutSharingComponent,
    LazyMapComponent,
  ],
  imports: [CommonModule, AppAngularMaterialModule, AppTranslocoModule, LandingRoutingModule],
  bootstrap: [LandingComponent],
})
export class LandingModule {}
