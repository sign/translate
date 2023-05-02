import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AppNgxsModule} from '../../../../core/modules/ngxs/ngxs.module';
import {AvatarPoseViewerComponent} from './avatar-pose-viewer.component';

describe('AvatarPoseViewerComponent', () => {
  let component: AvatarPoseViewerComponent;
  let fixture: ComponentFixture<AvatarPoseViewerComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvatarPoseViewerComponent],
      imports: [AppNgxsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarPoseViewerComponent);
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
