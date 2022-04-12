import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppearanceComponent} from './appearance.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NgxsModule} from '@ngxs/store';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {SettingsState} from '../../../modules/settings/settings.state';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AppTranslocoModule} from '../../../core/modules/transloco/transloco.module';

describe('AppearanceComponent', () => {
  let component: AppearanceComponent;
  let fixture: ComponentFixture<AppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppearanceComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        AppTranslocoModule,
        NgxsModule.forRoot([SettingsState], ngxsConfig)
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
