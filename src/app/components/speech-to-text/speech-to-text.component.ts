import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {fromEvent} from 'rxjs';
import {BaseComponent} from '../base/base.component';

const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.css']
})
export class SpeechToTextComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() lang = 'en';
  @Output() changeText: EventEmitter<string> = new EventEmitter<string>();

  speechRecognition: SpeechRecognition = new SpeechRecognition();

  supportError = null;
  isRecording = false;

  ngOnInit(): void {
    this.speechRecognition.interimResults = true;

    fromEvent(this.speechRecognition, 'result').subscribe((event: SpeechRecognitionEvent) => {
      const transcription = event.results[0][0].transcript;
      this.changeText.emit(transcription);
    });

    fromEvent(this.speechRecognition, 'error').subscribe((event: SpeechRecognitionErrorEvent) => {
      if (['not-allowed', 'language-not-supported'].includes(event.error)) {
        this.supportError = event.error;
      } else {
        this.supportError = null;
      }
    });

    fromEvent(this.speechRecognition, 'start').subscribe(() => {
      this.changeText.emit('');
      this.isRecording = true;
    });
    fromEvent(this.speechRecognition, 'end').subscribe(() => this.isRecording = false);

    fromEvent(this.speechRecognition, 'speechend').subscribe(this.stop.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lang) {
      this.speechRecognition.lang = this.lang;
    }
  }

  start(): void {
    this.speechRecognition.start();
  }

  stop(): void {
    this.speechRecognition.stop();
  }

}
