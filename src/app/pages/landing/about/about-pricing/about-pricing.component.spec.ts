import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutPricingComponent} from './about-pricing.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';
import {ReactiveFormsModule} from '@angular/forms';

describe('AboutPricingComponent', () => {
  let component: AboutPricingComponent;
  let fixture: ComponentFixture<AboutPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutPricingComponent],
      imports: [AppTranslocoTestingModule, IonicModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPricingComponent);
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
