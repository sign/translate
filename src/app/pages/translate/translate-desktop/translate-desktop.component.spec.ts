import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateDesktopComponent} from './translate-desktop.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {TranslateState} from '../../../modules/translate/translate.state';
import {VideoState} from '../../../core/modules/ngxs/store/video/video.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {provideHttpClient} from '@angular/common/http';

describe('TranslateDesktopComponent', () => {
  let component: TranslateDesktopComponent;
  let fixture: ComponentFixture<TranslateDesktopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranslateDesktopComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        AppTranslocoTestingModule,
        MatTabsModule,
        MatTooltipModule,
        NoopAnimationsModule,
        NgxsModule.forRoot([SettingsState, TranslateState, VideoState], ngxsConfig),
        RouterTestingModule,
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(TranslateDesktopComponent);
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
