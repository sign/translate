import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {VideoComponent} from './video.component';
import {SettingsState} from '../../modules/settings/settings.state';
import {VideoState} from '../../core/modules/ngxs/store/video/video.state';
import {SignWritingState} from '../../modules/sign-writing/sign-writing.state';
import {PoseState} from '../../modules/pose/pose.state';
import {DetectorState} from '../../modules/detector/detector.state';
import {provideStore} from '@ngxs/store';
import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {ngxsConfig} from '../../app.config';

describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, VideoComponent],
      providers: [provideStore([SettingsState, VideoState, SignWritingState, PoseState, DetectorState], ngxsConfig)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoComponent);
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
});
