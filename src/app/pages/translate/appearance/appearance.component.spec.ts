import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AppearanceComponent} from './appearance.component';
import {NgxsModule} from '@ngxs/store';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {SettingsState} from '../../../modules/settings/settings.state';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {AppAngularMaterialModule} from '../../../core/modules/angular-material/angular-material.module';

describe('AppearanceComponent', () => {
  let component: AppearanceComponent;
  let fixture: ComponentFixture<AppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppearanceComponent],
      imports: [AppAngularMaterialModule, AppTranslocoTestingModule, NgxsModule.forRoot([SettingsState], ngxsConfig)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceComponent);
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
