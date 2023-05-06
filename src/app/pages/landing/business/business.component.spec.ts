import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BusinessComponent} from './business.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AboutHeroComponent} from '../about/about-hero/about-hero.component';
import {AboutAppearanceComponent} from '../about/about-appearance/about-appearance.component';
import {AboutBenefitsComponent} from '../about/about-benefits/about-benefits.component';
import {AboutDirectionComponent} from '../about/about-direction/about-direction.component';
import {AboutApiComponent} from '../about/about-api/about-api.component';
import {AboutOfflineComponent} from '../about/about-offline/about-offline.component';
import {StoresComponent} from '../../../components/stores/stores.component';
import {AboutFaqComponent} from '../about/about-faq/about-faq.component';
import {AboutCustomersComponent} from '../about/about-customers/about-customers.component';
import {AboutPricingComponent} from '../about/about-pricing/about-pricing.component';
import {AboutObjectivesComponent} from '../about/about-objectives/about-objectives.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {SettingsPageModule} from '../../settings/settings.module';
import {AppNgxsModule} from '../../../core/modules/ngxs/ngxs.module';
import {AboutTeamComponent} from '../about/about-team/about-team.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {IonicModule} from '@ionic/angular';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';

describe('BusinessComponent', () => {
  let component: BusinessComponent;
  let fixture: ComponentFixture<BusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BusinessComponent,
        AboutHeroComponent,
        AboutAppearanceComponent,
        AboutBenefitsComponent,
        AboutDirectionComponent,
        AboutApiComponent,
        AboutOfflineComponent,
        AboutFaqComponent,
        AboutCustomersComponent,
        AboutPricingComponent,
        AboutObjectivesComponent,
        AboutTeamComponent,
        StoresComponent,
      ],
      imports: [
        AppTranslocoTestingModule,
        SettingsPageModule,
        MatTooltipModule,
        IonicModule.forRoot(),
        MatExpansionModule,
        MatTabsModule,
        AppNgxsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement, {
      // This component is not contained within a `mat-sidenav-content`, and thus has the wrong colors in dark mode
      rules: {
        'color-contrast': {
          enabled: false,
        },
      },
    });
    expect(a11y).toHaveNoViolations();
  });
});
