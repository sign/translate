import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {TranslateInputButtonComponent} from './button.component';
import {NgxsModule, Store} from '@ngxs/store';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {AppTranslocoTestingModule} from '../../../../core/modules/transloco/transloco-testing.module';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {SetInputMode} from '../../../../modules/translate/translate.actions';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '../../../../modules/translate/translate.module';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('TranslateInputButtonComponent', () => {
  let store: Store;
  let component: TranslateInputButtonComponent;
  let fixture: ComponentFixture<TranslateInputButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranslateInputButtonComponent],
      imports: [
        IonicModule.forRoot(),
        AppTranslocoTestingModule,
        NgxsModule.forRoot([SettingsState], ngxsConfig),
        TranslateModule,
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
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
