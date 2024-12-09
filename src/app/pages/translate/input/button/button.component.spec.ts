import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {TranslateInputButtonComponent} from './button.component';
import {provideStore, Store} from '@ngxs/store';
import {ngxsConfig} from '../../../../app.config';

import {SettingsState} from '../../../../modules/settings/settings.state';
import {SetInputMode} from '../../../../modules/translate/translate.actions';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {TranslateState} from '../../../../modules/translate/translate.state';

describe('TranslateInputButtonComponent', () => {
  let store: Store;
  let component: TranslateInputButtonComponent;
  let fixture: ComponentFixture<TranslateInputButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, TranslateInputButtonComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideIonicAngular(),
        provideStore([SettingsState, TranslateState], ngxsConfig),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateInputButtonComponent);
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

  it('button click should dispatch set mode action', fakeAsync(() => {
    component.mode = 'test' as any;
    const spy = spyOn(store, 'dispatch');
    const button = fixture.nativeElement.querySelector('ion-button');
    button.click();

    expect(spy).toHaveBeenCalledWith(new SetInputMode('test' as any));
    expect(spy).toHaveBeenCalledTimes(1);
  }));
});
