import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {VideoControlsComponent} from './video-controls.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../core/modules/ngxs/ngxs.module';
import {IonicModule} from '@ionic/angular';
import {MatTooltipModule} from '@angular/material/tooltip';

describe('VideoControlsComponent', () => {
  let component: VideoControlsComponent;
  let fixture: ComponentFixture<VideoControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VideoControlsComponent],
      imports: [
        AppTranslocoTestingModule,
        MatTooltipModule,
        IonicModule.forRoot(),
        NgxsModule.forRoot([SettingsState], ngxsConfig),
      ],
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

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });
});
