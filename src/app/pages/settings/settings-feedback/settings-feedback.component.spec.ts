import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsFeedbackComponent} from './settings-feedback.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {IonicModule} from '@ionic/angular';

describe('SettingsFeedbackComponent', () => {
  let component: SettingsFeedbackComponent;
  let fixture: ComponentFixture<SettingsFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsFeedbackComponent],
      imports: [AppTranslocoTestingModule, IonicModule.forRoot(), NgxsModule.forRoot([SettingsState], ngxsConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsFeedbackComponent);
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
