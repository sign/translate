import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {fromEvent} from 'rxjs';
import {BaseComponent} from '../base/base.component';
import {TooltipPosition} from '@angular/material/tooltip';

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.css'],
})
export class SpeechToTextComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() lang = 'en';
  @Output() changeText: EventEmitter<string> = new EventEmitter<string>();
  @Input() matTooltipPosition: TooltipPosition = 'above';

  SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
  speechRecognition!: SpeechRecognition;

  supportError = null;
  isRecording = false;

  ngOnInit(): void {
    if (!this.SpeechRecognition) {
      this.supportError = 'browser-not-supported';
      return;
    }

    this.speechRecognition = new this.SpeechRecognition();
    this.speechRecognition.interimResults = true;
    this.speechRecognition.continuous = false;
    this.speechRecognition.lang = this.lang;

    fromEvent(this.speechRecognition, 'result').subscribe((event: SpeechRecognitionEvent) => {
      const transcription = event.results[0][0].transcript;
      this.changeText.emit(transcription);
    });

    fromEvent(this.speechRecognition, 'error').subscribe((event: SpeechRecognitionErrorEvent) => {
      console.error('error', event.error);

      if (['not-allowed', 'language-not-supported', 'service-not-allowed'].includes(event.error)) {
        this.supportError = event.error;
      } else {
        this.supportError = null;
      }

      // Try accessing microphone, to request permission
      if (event.error === 'not-allowed') {
        this.requestPermission();
      }
    });

    fromEvent(this.speechRecognition, 'start').subscribe(() => {
      console.error('start');

      this.changeText.emit('');
      this.isRecording = true;
    });

    // TODO: ongoing safari bug: on end, microphone is still active
    // https://stackoverflow.com/questions/75498609/safari-webkitspeechrecognition-continuous-bug
    fromEvent(this.speechRecognition, 'end').subscribe(() => {
      this.isRecording = false;
      this.speechRecognition.stop(); // Explicitly stop the recognition service, to disengage the microphone
    });

    fromEvent(this.speechRecognition, 'speechend').subscribe(this.stop.bind(this));
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
    this.speechRecognition.start();
  }

  stop() {
    this.speechRecognition.stop();
  }
}
