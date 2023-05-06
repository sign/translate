import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {VideoComponent} from './video.component';
import {VideoControlsComponent} from './video-controls/video-controls.component';
import {AnimationComponent} from '../animation/animation.component';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../modules/settings/settings.state';
import {ngxsConfig} from '../../core/modules/ngxs/ngxs.module';
import {VideoState} from '../../core/modules/ngxs/store/video/video.state';
import {SignWritingState} from '../../modules/sign-writing/sign-writing.state';
import {PoseState} from '../../modules/pose/pose.state';
import {DetectorState} from '../../modules/detector/detector.state';
import {IonicModule} from '@ionic/angular';
import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {MatTooltipModule} from '@angular/material/tooltip';

describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VideoComponent, VideoControlsComponent, AnimationComponent],
      imports: [
        AppTranslocoTestingModule,
        MatTooltipModule,
        IonicModule.forRoot(),
        NgxsModule.forRoot([SettingsState, VideoState, SignWritingState, PoseState, DetectorState], ngxsConfig),
      ],
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
