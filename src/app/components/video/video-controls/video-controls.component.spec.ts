import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {VideoControlsComponent} from './video-controls.component';
import {AppTranslocoModule} from '../../../core/modules/transloco/transloco.module';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';

describe('VideoControlsComponent', () => {
  let component: VideoControlsComponent;
  let fixture: ComponentFixture<VideoControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VideoControlsComponent],
      imports: [
        AppTranslocoModule,
        NgxsModule.forRoot([SettingsState], ngxsConfig)
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
