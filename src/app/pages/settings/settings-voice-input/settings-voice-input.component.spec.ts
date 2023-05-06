import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsVoiceInputComponent} from './settings-voice-input.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {IonicModule} from '@ionic/angular';
import {MatTooltipModule} from '@angular/material/tooltip';

describe('SettingsVoiceInputComponent', () => {
  let component: SettingsVoiceInputComponent;
  let fixture: ComponentFixture<SettingsVoiceInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsVoiceInputComponent],
      imports: [
        MatTooltipModule,
        AppTranslocoTestingModule,
        IonicModule.forRoot(),
        NgxsModule.forRoot([SettingsState], ngxsConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsVoiceInputComponent);
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
