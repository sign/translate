import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsVoiceOutputComponent} from './settings-voice-output.component';
import {AppAngularMaterialModule} from '../../../core/modules/angular-material/angular-material.module';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';

describe('SettingsVoiceOutputComponent', () => {
  let component: SettingsVoiceOutputComponent;
  let fixture: ComponentFixture<SettingsVoiceOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsVoiceOutputComponent],
      imports: [AppAngularMaterialModule, AppTranslocoTestingModule, NgxsModule.forRoot([SettingsState], ngxsConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsVoiceOutputComponent);
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
