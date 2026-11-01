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
import {Store} from '@ngxs/store';
import {FlipTranslationDirection} from '../../../modules/translate/translate.actions';
import {firstValueFrom} from 'rxjs';

describe('LanguageSelectorsComponent', () => {
  let component: LanguageSelectorsComponent;
  let fixture: ComponentFixture<LanguageSelectorsComponent>;
  let store: Store;

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
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should swap from sign to text mode', async () => {
    await firstValueFrom(store.dispatch(FlipTranslationDirection));
    expect(store.selectSnapshot(state => state.translate.spokenToSigned)).toBeFalse();

    await firstValueFrom(component.swapLanguages());

    expect(store.selectSnapshot(state => state.translate.spokenToSigned)).toBeTrue();
    expect(store.selectSnapshot(state => state.translate.inputMode)).toBe('text');
  });

  // TODO: Fix accessibility test once https://github.com/ionic-team/ionic-framework/issues/30047 is resolved
  // it('should pass accessibility test', async () => {
  //   jasmine.addMatchers(toHaveNoViolations);
  //   const a11y = await axe(fixture.nativeElement);
  //   expect(a11y).toHaveNoViolations();
  // });
});
