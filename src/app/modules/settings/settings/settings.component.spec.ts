import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {SettingsComponent} from './settings.component';
import {NgxsModule, Store} from '@ngxs/store';
import {SettingsState} from '../settings.state';
import {FormsModule} from '@angular/forms';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';

describe('SettingsComponent', () => {
  let store: Store;
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [
        NgxsModule.forRoot([SettingsState], ngxsConfig),
        FormsModule,
        AppTranslocoTestingModule,
        IonicModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
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

  it('applySetting should change the setting in the state', () => {
    store.reset({settings: {drawVideo: false}});

    component.applySetting('drawVideo', true);

    const snapshot = store.snapshot();
    expect(snapshot.settings.drawVideo).toBeTrue();
  });

  it('changeSetting should modify setting', () => {
    component.availableSettings = ['drawVideo'];
    store.reset({settings: {drawVideo: true}});

    const spy = spyOn(component, 'applySetting');

    component.changeSetting('drawVideo', {detail: {checked: false}} as any);

    expect(spy.calls.argsFor(0)).toEqual(['drawVideo', false]);
  });
});
