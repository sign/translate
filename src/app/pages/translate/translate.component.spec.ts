import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {TranslateComponent} from './translate.component';
import {provideStore, Store} from '@ngxs/store';
import {TranslateState} from '../../modules/translate/translate.state';
import {SettingsState} from '../../modules/settings/settings.state';
import {TranslocoService} from '@jsverse/transloco';
import {VideoState} from '../../core/modules/ngxs/store/video/video.state';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {ngxsConfig} from '../../app.config';
import {provideRouter} from '@angular/router';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('TranslateComponent', () => {
  let store: Store;
  let component: TranslateComponent;
  let fixture: ComponentFixture<TranslateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, NoopAnimationsModule, TranslateComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([SettingsState, TranslateState, VideoState], ngxsConfig),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });

  it('language change should change title', async () => {
    const transloco = TestBed.inject(TranslocoService);

    transloco.setActiveLang('he');
    expect(document.title).toEqual('תרגום סימנים');

    transloco.setActiveLang('en');
    expect(document.title).toEqual('Sign Translate');
  });

  // TODO test state
  //
  // it('swapLanguages should turn spoken-to-signed to signed-to-spoken', () => {
  //   component.spokenToSigned = true;
  //   const spy = spyOn(component, 'setInputMode');
  //
  //   component.swapLanguages();
  //
  //   expect(component.spokenToSigned).toBeFalse();
  //   expect(spy).toHaveBeenCalledWith('webcam');
  // });
  // it('swapLanguages should turn signed-to-spoken to spoken-to-signed', () => {
  //   component.spokenToSigned = false;
  //
  //   component.swapLanguages();
  //
  //   expect(store.snapshot().translate.spokenToSigned).toBeTrue();
  //   expect(component.spokenToSigned).toBeTrue();
  // });
  //
  // for (const mode of ['text', 'upload']) {
  //   it(`setInputMode "${mode}" should StopVideo`, () => {
  //     const spy = spyOn(store, 'dispatch');
  //
  //     component.setInputMode(mode as InputMode);
  //
  //     expect(store.snapshot().translate.inputMode).toBe(mode);
  //     expect(spy).toHaveBeenCalledOnceWith(StopVideo);
  //   });
  // }
  //
  // it('setInputMode "webcam" should StopVideo and StartCamera', () => {
  //   component.inputMode = 'text';
  //   const spy = spyOn(store, 'dispatch');
  //
  //   component.setInputMode('webcam');
  //
  //   expect(component.inputMode).toBe('webcam');
  //   expect(spy.calls.count()).toBe(2);
  //   expect(spy.calls.argsFor(0)[0]).toBe(StopVideo);
  //   expect(spy.calls.argsFor(1)[0]).toBe(StartCamera);
  // });
});
