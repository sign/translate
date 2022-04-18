import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {PlaygroundComponent} from './playground.component';
import {NgxsModule, Store} from '@ngxs/store';
import {ngxsConfig} from '../../core/modules/ngxs/ngxs.module';
import {SettingsState} from '../../modules/settings/settings.state';
import {AppAngularMaterialModule} from '../../core/modules/angular-material/angular-material.module';
import {StartCamera} from '../../core/modules/ngxs/store/video/video.actions';
import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {SettingsComponent} from '../../modules/settings/settings/settings.component';
import {TranslateState} from '../../modules/translate/translate.state';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

describe('PlaygroundComponent', () => {
  let component: PlaygroundComponent;
  let fixture: ComponentFixture<PlaygroundComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaygroundComponent, SettingsComponent],
      imports: [
        AppAngularMaterialModule,
        NoopAnimationsModule,
        AppTranslocoTestingModule,
        NgxsModule.forRoot([SettingsState, TranslateState], ngxsConfig),
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    store.reset({settings: {receiveVideo: false}});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });

  it('should start camera when receiveVideo', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    store.reset({settings: {receiveVideo: true}});
    expect(dispatchSpy).toHaveBeenCalledWith(StartCamera);
  });
});
