import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NgxsModule} from '@ngxs/store';
import {SettingsState} from '../../../../modules/settings/settings.state';
import {ngxsConfig} from '../../../../core/modules/ngxs/ngxs.module';
import {AvatarPoseViewerComponent} from './avatar-pose-viewer.component';

describe('AvatarPoseViewerComponent', () => {
  let component: AvatarPoseViewerComponent;
  let fixture: ComponentFixture<AvatarPoseViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvatarPoseViewerComponent],
      imports: [
        NgxsModule.forRoot([SettingsState], ngxsConfig)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
});
