import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.css']
})
export class TextToSpeechComponent implements OnInit, OnDestroy, OnChanges {
  @Input() lang = 'en';
  @Input() text = '';

  voices: SpeechSynthesisVoice[] = [];
  isSupported = false;
  isSpeaking = false;

  private speech = new SpeechSynthesisUtterance();

  private listeners: { [key: string]: EventListener } = {};

  constructor() {
  }

  ngOnInit(): void {
    this.listeners.voiceschanged = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.setVoice();
    };

    for (const [type, listener] of Object.entries(this.listeners)) {
      window.speechSynthesis.addEventListener(type, listener);
    }

    this.speech.addEventListener('start', () => this.isSpeaking = true);
    this.speech.addEventListener('end', () => this.isSpeaking = false);
  }

  ngOnDestroy(): void {
    for (const [type, listener] of Object.entries(this.listeners)) {
      window.speechSynthesis.removeEventListener(type, listener);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lang) {
      this.speech.lang = this.lang;
      this.setVoice();
    }
  }

  setVoice(): void {
    this.isSupported = false;

    if (this.voices.length === 0) {
      return;
    }
    // Try to find a local voice for the language
    const localVoice = this.voices.find(v => v.localService && v.lang.startsWith(this.lang));
    if (localVoice) {
      this.speech.voice = localVoice;
      this.isSupported = true;
      return;
    }

    // Try to find any voice for the language
    const voice = this.voices.find(v => v.lang.startsWith(this.lang));
    if (voice) {
      this.speech.voice = localVoice;
      this.isSupported = true;
      return;
    }
  }

  play(): void {
    this.speech.text = this.text;
    window.speechSynthesis.speak(this.speech);
  }

  cancel(): void {
    window.speechSynthesis.cancel();
  }
}
