import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpeechRecognition, SpeechToTextComponent} from './speech-to-text.component';

describe('SpeechToTextComponent', () => {
  let component: SpeechToTextComponent;
  let fixture: ComponentFixture<SpeechToTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpeechToTextComponent]
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

  if (SpeechRecognition) {
    it('start should start speech recognition', () => {
      const startSpy = spyOn(component.speechRecognition, 'start').and.callFake(() => {
        component.speechRecognition.dispatchEvent(new Event('start'));
      });
      const changeTextSpy = spyOn(component.changeText, 'emit');

      expect(component.isRecording).toBeFalse();

      component.start();

      expect(startSpy).toHaveBeenCalled();
      expect(changeTextSpy).toHaveBeenCalledWith('');
      expect(component.isRecording).toBeTrue();
    });

    it('stop should stop speech recognition', () => {
      component.isRecording = true;

      const stopSpy = spyOn(component.speechRecognition, 'stop').and.callFake(() => {
        component.speechRecognition.dispatchEvent(new Event('end'));
      });

      component.stop();

      expect(stopSpy).toHaveBeenCalled();
      expect(component.isRecording).toBeFalse();
    });
  }
});
