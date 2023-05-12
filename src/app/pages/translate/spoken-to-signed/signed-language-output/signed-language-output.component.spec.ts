import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignedLanguageOutputComponent} from './signed-language-output.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {TranslateState} from '../../../../modules/translate/translate.state';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('SignedLanguageOutputComponent', () => {
  let component: SignedLanguageOutputComponent;
  let fixture: ComponentFixture<SignedLanguageOutputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignedLanguageOutputComponent],
      imports: [
        NgxsModule.forRoot([SettingsState, TranslateState], ngxsConfig),
        HttpClientTestingModule,
        AppTranslocoTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(SignedLanguageOutputComponent);
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
