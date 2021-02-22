import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AudioInstructionsComponent} from './audio-instructions.component';

describe('AudioInstructionsComponent', () => {
  let component: AudioInstructionsComponent;
  let fixture: ComponentFixture<AudioInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AudioInstructionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
