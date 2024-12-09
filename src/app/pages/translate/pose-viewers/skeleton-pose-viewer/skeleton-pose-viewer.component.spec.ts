import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {SkeletonPoseViewerComponent} from './skeleton-pose-viewer.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../app.config';

describe('SkeletonPoseViewerComponent', () => {
  let component: SkeletonPoseViewerComponent;
  let fixture: ComponentFixture<SkeletonPoseViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SettingsState], ngxsConfig), SkeletonPoseViewerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });
});
