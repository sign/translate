import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsAppearanceImagesComponent} from './settings-appearance-images.component';

import {provideStore} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../app.config';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';

describe('SettingsAppearanceImagesComponent', () => {
  let component: SettingsAppearanceImagesComponent;
  let fixture: ComponentFixture<SettingsAppearanceImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, SettingsAppearanceImagesComponent],
      providers: [provideIonicAngular(), provideStore([SettingsState], ngxsConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAppearanceImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement, {
      rules: {
        'role-img-alt': {
          enabled: false,
        },
      },
    });
    expect(a11y).toHaveNoViolations();
  });
});
