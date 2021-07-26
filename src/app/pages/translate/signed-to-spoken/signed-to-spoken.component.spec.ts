import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignedToSpokenComponent} from './signed-to-spoken.component';
import {NgxsModule} from '@ngxs/store';
import {VideoState} from '../../../core/modules/ngxs/store/video/video.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {SettingsState} from '../../../modules/settings/settings.state';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateState} from '../../../modules/translate/translate.state';

describe('SignedToSpokenComponent', () => {
  let component: SignedToSpokenComponent;
  let fixture: ComponentFixture<SignedToSpokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignedToSpokenComponent],
      imports: [
        NgxsModule.forRoot([SettingsState, TranslateState, VideoState], ngxsConfig)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
});
