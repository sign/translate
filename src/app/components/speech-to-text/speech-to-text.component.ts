import {Component, Input, OnChanges, OnInit, output, SimpleChanges} from '@angular/core';
import {fromEvent} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../base/base.component';
import {MatTooltipModule, TooltipPosition} from '@angular/material/tooltip';
import {IonButton, IonIcon} from '@ionic/angular/standalone';
import {TranslocoDirective} from '@jsverse/transloco';
import {addIcons} from 'ionicons';
import {micOutline, stopCircleOutline} from 'ionicons/icons';

const FATAL_ERRORS = ['not-allowed', 'language-not-supported', 'service-not-allowed'];

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.css'],
  imports: [IonButton, IonIcon, MatTooltipModule, TranslocoDirective],
})
export class SpeechToTextComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() lang = 'en';
  readonly changeText = output<string>();
  @Input() matTooltipPosition: TooltipPosition = 'above';

  SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
  speechRecognition!: SpeechRecognition;

  supportError = null;
  isRecording = false;

  // The browser ends recognition on its own after a few seconds of silence. While the user
  // wants to keep recording, we restart it on `end` so dictation survives natural pauses.
  private userRequestedRecording = false;
  private committedTranscript = '';
  private sessionTranscript = '';

  constructor() {
    super();

    addIcons({stopCircleOutline, micOutline});
  }

  ngOnInit(): void {
    if (!this.SpeechRecognition) {
      this.supportError = 'browser-not-supported';
      return;
    }

    this.speechRecognition = new this.SpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.lang = this.lang;

    fromEvent(this.speechRecognition, 'result')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        this.sessionTranscript = final;
        this.changeText.emit(this.committedTranscript + final + interim);
      });

    fromEvent(this.speechRecognition, 'error')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: SpeechRecognitionErrorEvent) => {
        if (FATAL_ERRORS.includes(event.error)) {
          this.supportError = event.error;
          this.userRequestedRecording = false;
        } else {
          this.supportError = null;
        }

        // Try accessing microphone, to request permission
        if (event.error === 'not-allowed') {
          this.requestPermission();
        }
      });

    fromEvent(this.speechRecognition, 'start')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.isRecording = true;
      });

    fromEvent(this.speechRecognition, 'end')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.committedTranscript += this.sessionTranscript;
        this.sessionTranscript = '';

        if (this.userRequestedRecording) {
          this.safeStart();
        } else {
          this.isRecording = false;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lang && this.speechRecognition) {
      this.speechRecognition.lang = this.lang;
    }
  }

  requestPermission() {
    navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream => {
      stream.getTracks().forEach(track => track.stop());
      this.supportError = null;
    });
  }

  start() {
    this.userRequestedRecording = true;
    this.committedTranscript = '';
    this.sessionTranscript = '';
    this.changeText.emit('');
    this.safeStart();
  }

  stop() {
    this.userRequestedRecording = false;
    // TODO: ongoing safari bug: the microphone can stay active after stop
    // https://stackoverflow.com/questions/75498609/safari-webkitspeechrecognition-continuous-bug
    this.speechRecognition.stop();
  }

  private safeStart() {
    try {
      this.speechRecognition.start();
    } catch {
      // start() throws InvalidStateError when recognition is already running; the existing
      // session keeps the microphone open, so there is nothing to recover from.
    }
  }
}
