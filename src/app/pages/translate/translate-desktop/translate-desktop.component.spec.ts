import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslateDesktopComponent} from './translate-desktop.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {provideStore} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {TranslateState} from '../../../modules/translate/translate.state';
import {VideoState} from '../../../core/modules/ngxs/store/video/video.state';
import {ngxsConfig} from '../../../app.config';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {provideRouter} from '@angular/router';

describe('TranslateDesktopComponent', () => {
  let component: TranslateDesktopComponent;
  let fixture: ComponentFixture<TranslateDesktopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AppTranslocoTestingModule, NoopAnimationsModule, TranslateDesktopComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([SettingsState, TranslateState, VideoState], ngxsConfig),
      ],
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
