import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageSelectorsComponent} from './language-selectors.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {TranslateState} from '../../../modules/translate/translate.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {provideHttpClient} from '@angular/common/http';

describe('LanguageSelectorsComponent', () => {
  let component: LanguageSelectorsComponent;
  let fixture: ComponentFixture<LanguageSelectorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageSelectorsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [NgxsModule.forRoot([SettingsState, TranslateState], ngxsConfig), AppTranslocoTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(LanguageSelectorsComponent);
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
