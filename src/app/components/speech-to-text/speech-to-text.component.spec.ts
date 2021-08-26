import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechToTextComponent } from './speech-to-text.component';

describe('SpeechToTextComponent', () => {
  let component: SpeechToTextComponent;
  let fixture: ComponentFixture<SpeechToTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeechToTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechToTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
