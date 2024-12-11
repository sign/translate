import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageSelectorsComponent} from './language-selectors.component';
import {provideStore} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {TranslateState} from '../../../modules/translate/translate.state';
import {ngxsConfig} from '../../../app.config';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {provideIonicAngular} from '@ionic/angular/standalone';

describe('LanguageSelectorsComponent', () => {
  let component: LanguageSelectorsComponent;
  let fixture: ComponentFixture<LanguageSelectorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, NoopAnimationsModule, LanguageSelectorsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
        provideStore([SettingsState, TranslateState], ngxsConfig),
      ],
    });
    fixture = TestBed.createComponent(LanguageSelectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Fix accessibility test once https://github.com/ionic-team/ionic-framework/issues/30047 is resolved
  // it('should pass accessibility test', async () => {
  //   jasmine.addMatchers(toHaveNoViolations);
  //   const a11y = await axe(fixture.nativeElement);
  //   expect(a11y).toHaveNoViolations();
  // });
});
