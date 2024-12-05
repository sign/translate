import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignedLanguageOutputComponent} from './signed-language-output.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {provideStore} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {TranslateState} from '../../../../modules/translate/translate.state';
import {ngxsConfig} from '../../../../app.config';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';

describe('SignedLanguageOutputComponent', () => {
  let component: SignedLanguageOutputComponent;
  let fixture: ComponentFixture<SignedLanguageOutputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, SignedLanguageOutputComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([SettingsState, TranslateState], ngxsConfig),
      ],
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
