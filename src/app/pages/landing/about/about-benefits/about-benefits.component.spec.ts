import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutBenefitsComponent} from './about-benefits.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';

describe('AboutBenefitsComponent', () => {
  let component: AboutBenefitsComponent;
  let fixture: ComponentFixture<AboutBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutBenefitsComponent],
      imports: [AppTranslocoTestingModule, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutBenefitsComponent);
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
