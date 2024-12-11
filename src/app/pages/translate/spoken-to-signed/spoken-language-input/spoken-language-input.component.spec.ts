import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {SpokenLanguageInputComponent} from './spoken-language-input.component';
import {SetSpokenLanguageText, SuggestAlternativeText} from '../../../../modules/translate/translate.actions';
import {provideStore, Store} from '@ngxs/store';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../app.config';
import {provideHttpClient} from '@angular/common/http';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TranslateState} from '../../../../modules/translate/translate.state';

describe('SpokenLanguageInputComponent', () => {
  let component: SpokenLanguageInputComponent;
  let fixture: ComponentFixture<SpokenLanguageInputComponent>;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AppTranslocoTestingModule, SpokenLanguageInputComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([SettingsState, TranslateState], ngxsConfig),
      ],
    });
    fixture = TestBed.createComponent(SpokenLanguageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store);
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

  it('text change should dispatch actions', fakeAsync(() => {
    const spy = spyOn(store, 'dispatch');
    component.text.patchValue('test');
    tick(300);

    expect(spy).toHaveBeenCalledWith(new SetSpokenLanguageText('test'));
    expect(spy).toHaveBeenCalledTimes(1);
    tick(700);
    expect(spy).toHaveBeenCalledWith(new SuggestAlternativeText());
    expect(spy).toHaveBeenCalledTimes(2);
  }));
});
