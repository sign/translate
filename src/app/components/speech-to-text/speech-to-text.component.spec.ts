import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {SpeechToTextComponent} from './speech-to-text.component';
import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';
import {MatTooltipModule} from '@angular/material/tooltip';

describe('SpeechToTextComponent', () => {
  let component: SpeechToTextComponent;
  let fixture: ComponentFixture<SpeechToTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpeechToTextComponent],
      imports: [AppTranslocoTestingModule, MatTooltipModule, IonicModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechToTextComponent);
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

  if ('SpeechRecognition' in globalThis) {
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
