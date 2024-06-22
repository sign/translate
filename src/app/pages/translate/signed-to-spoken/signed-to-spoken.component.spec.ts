import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {SignedToSpokenComponent} from './signed-to-spoken.component';
import {NgxsModule} from '@ngxs/store';
import {VideoState} from '../../../core/modules/ngxs/store/video/video.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {SettingsState} from '../../../modules/settings/settings.state';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateState} from '../../../modules/translate/translate.state';
import {TextToSpeechComponent} from '../../../components/text-to-speech/text-to-speech.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('SignedToSpokenComponent', () => {
  let component: SignedToSpokenComponent;
  let fixture: ComponentFixture<SignedToSpokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignedToSpokenComponent, TextToSpeechComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [NgxsModule.forRoot([SettingsState, TranslateState, VideoState], ngxsConfig)],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedToSpokenComponent);
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
