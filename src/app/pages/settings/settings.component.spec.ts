import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsPageComponent} from './settings.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {MatTreeModule} from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import {SettingsMenuComponent} from './settings-menu/settings-menu.component';
import {SettingsOfflineComponent} from './settings-offline/settings-offline.component';
import {SettingsAppearanceComponent} from './settings-appearance/settings-appearance.component';
import {SettingsFeedbackComponent} from './settings-feedback/settings-feedback.component';
import {SettingsAboutComponent} from './settings-about/settings-about.component';
import {SettingsVoiceInputComponent} from './settings-voice-input/settings-voice-input.component';
import {SettingsVoiceOutputComponent} from './settings-voice-output/settings-voice-output.component';
import {SettingsAppearanceImagesComponent} from './settings-appearance/settings-appearance-images/settings-appearance-images.component';

xdescribe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SettingsPageComponent,
        SettingsOfflineComponent,
        SettingsAppearanceComponent,
        SettingsFeedbackComponent,
        SettingsAboutComponent,
        SettingsVoiceInputComponent,
        SettingsVoiceOutputComponent,
        SettingsMenuComponent,
        SettingsAppearanceImagesComponent,
      ],
      imports: [IonicModule.forRoot(), RouterTestingModule, MatTreeModule, CdkTreeModule, AppTranslocoTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPageComponent);
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
