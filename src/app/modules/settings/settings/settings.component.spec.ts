import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsComponent} from './settings.component';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../settings.state';
import {FormsModule} from '@angular/forms';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {AppTranslocoModule} from '../../../core/modules/transloco/transloco.module';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [
        NgxsModule.forRoot([SettingsState], ngxsConfig),
        FormsModule,
        AppTranslocoModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
