import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LandingFooterComponent} from './landing-footer.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {I18NLanguageSelectorComponent} from '../../../components/i18n-language-selector/i18n-language-selector.component';
import {RouterModule} from '@angular/router';
import {AboutComponent} from '../about/about.component';

describe('LandingFooterComponent', () => {
  let component: LandingFooterComponent;
  let fixture: ComponentFixture<LandingFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingFooterComponent, I18NLanguageSelectorComponent],
      imports: [
        AppTranslocoTestingModule,
        IonicModule.forRoot(),
        NoopAnimationsModule,
        RouterModule.forRoot([{path: '', component: LandingFooterComponent}]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });
});
