import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpokenToSignedComponent} from './spoken-to-signed.component';
import {SignWritingComponent} from '../signwriting/sign-writing.component';
import {TextToSpeechComponent} from '../../../components/text-to-speech/text-to-speech.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {TranslateState} from '../../../modules/translate/translate.state';

describe('SpokenToSignedComponent', () => {
  let component: SpokenToSignedComponent;
  let fixture: ComponentFixture<SpokenToSignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SpokenToSignedComponent,
        SignWritingComponent,
        TextToSpeechComponent
      ],
      imports: [
        NgxsModule.forRoot([SettingsState, TranslateState], ngxsConfig),
        FormsModule,
        ReactiveFormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpokenToSignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO test state
  // it('empty text should set pose to null', fakeAsync(() => {
  //   component.pose = '';
  //
  //   component.text.patchValue('');
  //   tick(500);
  //
  //   expect(component.pose).toBeNull();
  // }));
  //
  // it('non-empty text should set pose to a url', fakeAsync(() => {
  //   component.pose = null;
  //
  //   component.text.patchValue('test');
  //   tick(500);
  //
  //   expect(component.pose).toContain('http');
  // }));
});
