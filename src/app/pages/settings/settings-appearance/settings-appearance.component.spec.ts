import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsAppearanceComponent} from './settings-appearance.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {IonicModule} from '@ionic/angular';
import {SettingsAppearanceImagesComponent} from './settings-appearance-images/settings-appearance-images.component';
import {MatTooltipModule} from '@angular/material/tooltip';

describe('SettingsAppearanceComponent', () => {
  let component: SettingsAppearanceComponent;
  let fixture: ComponentFixture<SettingsAppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsAppearanceComponent, SettingsAppearanceImagesComponent],
      imports: [
        AppTranslocoTestingModule,
        MatTooltipModule,
        IonicModule.forRoot(),
        NgxsModule.forRoot([SettingsState], ngxsConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAppearanceComponent);
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
