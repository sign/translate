import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsVoiceOutputComponent} from './settings-voice-output.component';
import {provideStore} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../app.config';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';

describe('SettingsVoiceOutputComponent', () => {
  let component: SettingsVoiceOutputComponent;
  let fixture: ComponentFixture<SettingsVoiceOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, SettingsVoiceOutputComponent],
      providers: [provideStore([SettingsState], ngxsConfig)],
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
    const a11y = await axe(fixture.nativeElement, {
      rules: {
        'scrollable-region-focusable': {
          enabled: false,
        },
      },
    });
    expect(a11y).toHaveNoViolations();
  });
});
