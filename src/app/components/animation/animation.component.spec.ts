import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AnimationComponent} from './animation.component';
import {NgxsModule} from '@ngxs/store';
import {AnimationState} from '../../modules/animation/animation.state';
import {ngxsConfig} from '../../core/modules/ngxs/ngxs.module';
import {SettingsState} from '../../modules/settings/settings.state';
import {PoseState} from '../../modules/pose/pose.state';

describe('AnimationComponent', () => {
  let component: AnimationComponent;
  let fixture: ComponentFixture<AnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimationComponent],
      imports: [NgxsModule.forRoot([AnimationState, SettingsState, PoseState], ngxsConfig)]
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
});
