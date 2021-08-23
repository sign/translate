import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SkeletonPoseViewerComponent} from './skeleton-pose-viewer.component';
import {Pix2PixModule} from '../../../../modules/pix2pix/pix2pix.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';

describe('SkeletonPoseViewerComponent', () => {
  let component: SkeletonPoseViewerComponent;
  let fixture: ComponentFixture<SkeletonPoseViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkeletonPoseViewerComponent],
      imports: [
        Pix2PixModule,
        MatProgressBarModule,
        NgxsModule.forRoot([SettingsState], ngxsConfig)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonPoseViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
