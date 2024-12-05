import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {AvatarPoseViewerComponent} from './avatar-pose-viewer.component';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../app.config';
import {provideStore} from '@ngxs/store';

describe('AvatarPoseViewerComponent', () => {
  let component: AvatarPoseViewerComponent;
  let fixture: ComponentFixture<AvatarPoseViewerComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPoseViewerComponent],
      providers: [provideStore([SettingsState], ngxsConfig)],
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
