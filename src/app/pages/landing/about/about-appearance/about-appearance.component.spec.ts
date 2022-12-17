import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AboutAppearanceComponent} from './about-appearance.component';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {SettingsPageModule} from '../../../settings/settings.module';
import {AppNgxsModule} from '../../../../core/modules/ngxs/ngxs.module';

describe('AboutAppearanceComponent', () => {
  let component: AboutAppearanceComponent;
  let fixture: ComponentFixture<AboutAppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutAppearanceComponent],
      imports: [AppTranslocoTestingModule, SettingsPageModule, AppNgxsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAppearanceComponent);
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
