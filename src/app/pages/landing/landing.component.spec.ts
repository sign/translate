import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {LandingComponent} from './landing.component';
import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {IonicModule} from '@ionic/angular';
import {I18NLanguageSelectorComponent} from '../../components/i18n-language-selector/i18n-language-selector.component';
import {LandingFooterComponent} from './landing-footer/landing-footer.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingComponent, LandingFooterComponent, I18NLanguageSelectorComponent],
      imports: [
        AppTranslocoTestingModule,
        IonicModule.forRoot(),
        NoopAnimationsModule,
        RouterModule.forRoot([{path: '', component: AboutComponent}]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
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
