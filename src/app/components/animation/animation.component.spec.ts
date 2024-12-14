import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AnimationComponent} from './animation.component';
import {NgxsModule} from '@ngxs/store';
import {AnimationState} from '../../modules/animation/animation.state';
import {SettingsState} from '../../modules/settings/settings.state';
import {PoseState} from '../../modules/pose/pose.state';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ngxsConfig} from '../../app.config';

// TODO: restore tests once https://github.com/google/model-viewer/issues/4972 is solved
xdescribe('AnimationComponent', () => {
  let component: AnimationComponent;
  let fixture: ComponentFixture<AnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AnimationState, SettingsState, PoseState], ngxsConfig), AnimationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationComponent);
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
