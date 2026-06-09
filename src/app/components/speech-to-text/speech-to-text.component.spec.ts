import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {SpeechToTextComponent} from './speech-to-text.component';
import {AppTranslocoTestingModule} from '../../core/modules/transloco/transloco-testing.module';
import {provideIonicAngular} from '@ionic/angular/standalone';

interface ResultPart {
  transcript: string;
  isFinal: boolean;
}

function makeResults(parts: ResultPart[]) {
  return parts.map(part => {
    const result = [{transcript: part.transcript}] as unknown as SpeechRecognitionResult;
    (result as {isFinal: boolean}).isFinal = part.isFinal;
    return result;
  });
}

class MockSpeechRecognition extends EventTarget {
  continuous = false;
  interimResults = false;
  lang = '';
  running = false;
  startCalls = 0;

  start(): void {
    this.startCalls++;
    this.running = true;
    this.dispatchEvent(new Event('start'));
  }

  stop(): void {
    if (this.running) {
      this.running = false;
      this.dispatchEvent(new Event('end'));
    }
  }

  emitResult(parts: ResultPart[]): void {
    const event = new Event('result') as Event & {results: SpeechRecognitionResult[]};
    event.results = makeResults(parts);
    this.dispatchEvent(event);
  }

  emitError(error: string): void {
    const event = new Event('error') as Event & {error: string};
    event.error = error;
    this.dispatchEvent(event);
  }

  endByBrowser(): void {
    this.running = false;
    this.dispatchEvent(new Event('end'));
  }
}

describe('SpeechToTextComponent', () => {
  let component: SpeechToTextComponent;
  let fixture: ComponentFixture<SpeechToTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTranslocoTestingModule, SpeechToTextComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechToTextComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // TODO: Fix accessibility test once https://github.com/ionic-team/ionic-framework/issues/30047 is resolved
  // it('should pass accessibility test', async () => {
  //   jasmine.addMatchers(toHaveNoViolations);
  //   const a11y = await axe(fixture.nativeElement);
  //   expect(a11y).toHaveNoViolations();
  // });

  describe('speech recognition', () => {
    let mock: MockSpeechRecognition;
    let emitted: string[];

    beforeEach(() => {
      (component as unknown as {SpeechRecognition: unknown}).SpeechRecognition = MockSpeechRecognition;
      component.ngOnInit();
      mock = component.speechRecognition as unknown as MockSpeechRecognition;

      emitted = [];
      component.changeText.subscribe(text => emitted.push(text));
    });

    const lastEmitted = () => emitted[emitted.length - 1];

    it('configures recognition for continuous dictation', () => {
      expect(mock.continuous).toBeTrue();
      expect(mock.interimResults).toBeTrue();
      expect(mock.lang).toBe(component.lang);
    });

    it('start clears the text and begins recording', () => {
      expect(component.isRecording).toBeFalse();

      component.start();

      expect(mock.startCalls).toBe(1);
      expect(lastEmitted()).toBe('');
      expect(component.isRecording).toBeTrue();
    });

    it('emits interim results as the user speaks', () => {
      component.start();
      mock.emitResult([{transcript: 'hel', isFinal: false}]);

      expect(lastEmitted()).toBe('hel');
    });

    it('accumulates final and interim results within a session', () => {
      component.start();
      mock.emitResult([
        {transcript: 'hello ', isFinal: true},
        {transcript: 'wor', isFinal: false},
      ]);

      expect(lastEmitted()).toBe('hello wor');
    });

    it('does not stop recording when speech pauses (speechend)', () => {
      component.start();
      expect(component.isRecording).toBeTrue();

      mock.dispatchEvent(new Event('speechend'));

      expect(component.isRecording).toBeTrue();
      expect(mock.running).toBeTrue();
    });

    it('auto-restarts when the browser ends the session while still recording', () => {
      component.start();

      mock.endByBrowser();

      expect(mock.startCalls).toBe(2);
      expect(component.isRecording).toBeTrue();
    });

    it('preserves the transcript across automatic restarts', () => {
      component.start();
      mock.emitResult([{transcript: 'hello', isFinal: true}]);

      mock.endByBrowser();
      mock.emitResult([{transcript: ' world', isFinal: true}]);

      expect(lastEmitted()).toBe('hello world');
    });

    it('stop ends recording and does not auto-restart', () => {
      component.start();

      component.stop();

      expect(component.isRecording).toBeFalse();
      expect(mock.startCalls).toBe(1);
    });

    it('starting again resets the accumulated transcript', () => {
      component.start();
      mock.emitResult([{transcript: 'first', isFinal: true}]);
      mock.endByBrowser();

      component.start();
      mock.emitResult([{transcript: 'second', isFinal: false}]);

      expect(lastEmitted()).toBe('second');
    });

    it('keeps listening after a transient no-speech error', () => {
      component.start();

      mock.emitError('no-speech');
      mock.endByBrowser();

      expect(component.supportError).toBeNull();
      expect(mock.startCalls).toBe(2);
      expect(component.isRecording).toBeTrue();
    });

    it('surfaces a fatal permission error and stops retrying', () => {
      spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(
        Promise.resolve({getTracks: () => []} as unknown as MediaStream)
      );
      component.start();

      mock.emitError('not-allowed');
      expect(component.supportError).toBe('not-allowed');

      mock.endByBrowser();
      expect(mock.startCalls).toBe(1);
    });

    it('ignores errors thrown when starting an already-active session', () => {
      spyOn(mock, 'start').and.throwError('InvalidStateError');

      expect(() => component.start()).not.toThrow();
    });

    it('stops handling events after the component is destroyed', () => {
      component.start();
      const count = emitted.length;

      component.ngOnDestroy();
      mock.emitResult([{transcript: 'ignored', isFinal: true}]);

      expect(emitted.length).toBe(count);
    });
  });
});
