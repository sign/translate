import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PlaygroundComponent} from './playground.component';
import {NgxsModule, Store} from '@ngxs/store';
import {ngxsConfig} from '../../core/modules/ngxs/ngxs.module';
import {SettingsState} from '../../modules/settings/settings.state';
import {AppAngularMaterialModule} from '../../core/modules/angular-material/angular-material.module';
import {StartCamera} from '../../core/modules/ngxs/store/video/video.actions';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {SettingsComponent} from '../../modules/settings/settings/settings.component';
import {TranslateState} from '../../modules/translate/translate.state';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';


describe('PlaygroundComponent', () => {
  let component: PlaygroundComponent;
  let fixture: ComponentFixture<PlaygroundComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PlaygroundComponent,
        SettingsComponent
      ],
      imports: [
        AppAngularMaterialModule,
        NoopAnimationsModule,
        AppTranslocoModule,
        NgxsModule.forRoot([SettingsState, TranslateState], ngxsConfig),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    store.reset({settings: {receiveVideo: false}});
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start camera when receiveVideo', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    store.reset({settings: {receiveVideo: true}});
    expect(dispatchSpy).toHaveBeenCalledWith(StartCamera);
  });
});
