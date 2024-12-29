import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {PlaygroundComponent} from './playground.component';
import {provideStore, Store} from '@ngxs/store';
import {StartCamera} from '../../core/modules/ngxs/store/video/video.actions';
import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {TranslocoService} from '@jsverse/transloco';
import {provideIonicAngular} from '@ionic/angular/standalone';
import {ngxsConfig} from '../../app.config';

describe('PlaygroundComponent', () => {
  let component: PlaygroundComponent;
  let fixture: ComponentFixture<PlaygroundComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, PlaygroundComponent],
      providers: [provideStore([], ngxsConfig), provideIonicAngular()],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    const snapshot = {...store.snapshot()};
    snapshot.settings = {...snapshot.settings, receiveVideo: false};
    store.reset(snapshot);

    fixture = TestBed.createComponent(PlaygroundComponent);
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

  it('should start camera when receiveVideo', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    const snapshot = {...store.snapshot()};
    const settings = {...snapshot.settings, receiveVideo: true};
    store.reset({settings});

    expect(dispatchSpy).toHaveBeenCalledWith(StartCamera);
  });

  it('language change should change title', async () => {
    const transloco = TestBed.inject(TranslocoService);

    transloco.setActiveLang('he');
    expect(document.title).toEqual('גן המשחקים לעיבוד שפת הסימנים');

    transloco.setActiveLang('en');
    expect(document.title).toEqual('Sign Language Processing Playground');
  });
});
