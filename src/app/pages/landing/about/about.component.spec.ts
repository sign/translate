import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AboutComponent} from './about.component';
import {AboutHeroComponent} from './about-hero/about-hero.component';
import {AboutDirectionComponent} from './about-direction/about-direction.component';
import {AboutOfflineComponent} from './about-offline/about-offline.component';
import {StoresComponent} from '../../../components/stores/stores.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {AboutAppearanceComponent} from './about-appearance/about-appearance.component';
import {AboutBenefitsComponent} from './about-benefits/about-benefits.component';
import {AboutApiComponent} from './about-api/about-api.component';
import {AppNgxsModule} from '../../../core/modules/ngxs/ngxs.module';
import {SettingsPageModule} from '../../settings/settings.module';
import {IonicModule} from '@ionic/angular';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AboutComponent,
        AboutHeroComponent,
        AboutAppearanceComponent,
        AboutBenefitsComponent,
        AboutDirectionComponent,
        AboutApiComponent,
        AboutOfflineComponent,
        StoresComponent,
      ],
      imports: [
        AppTranslocoTestingModule,
        MatTooltipModule,
        MatTabsModule,
        IonicModule.forRoot(),
        AppNgxsModule,
        SettingsPageModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
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
