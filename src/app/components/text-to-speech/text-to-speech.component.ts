import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.scss'],
})
export class TextToSpeechComponent implements OnInit, OnDestroy, OnChanges {
  @Input() lang = 'en';
  @Input() text = '';

  voices: SpeechSynthesisVoice[] = [];
  isSupported = false;
  isSpeaking = false;

  // SpeechSynthesisUtterance is not supported on Android native build
  speech: SpeechSynthesisUtterance = 'SpeechSynthesisUtterance' in globalThis ? new SpeechSynthesisUtterance() : null;

  private listeners: {[key: string]: EventListener} = {};

  ngOnInit(): void {
    if (!this.speech) {
      return;
    }

    const voicesLoaded = () => {
      this.voices = globalThis.speechSynthesis.getVoices();
      this.setVoice();
    };
    voicesLoaded(); // In case voices are already loaded

    // Safari does not support speechSynthesis events
    if ('addEventListener' in globalThis.speechSynthesis) {
      this.listeners.voiceschanged = voicesLoaded;

      for (const [type, listener] of Object.entries(this.listeners)) {
        globalThis.speechSynthesis.addEventListener(type, listener);
      }
    }

    this.speech.addEventListener('start', () => (this.isSpeaking = true));
    this.speech.addEventListener('end', () => (this.isSpeaking = false));
  }

  ngOnDestroy(): void {
    if (!this.speech) {
      return;
    }

    for (const [type, listener] of Object.entries(this.listeners)) {
      globalThis.speechSynthesis.removeEventListener(type, listener);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.speech) {
      return;
    }

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
      this.speech.voice = voice;
      this.isSupported = true;
      return;
    }
  }

  play(): void {
    this.speech.text = this.text;
    globalThis.speechSynthesis.speak(this.speech);
  }

  cancel(): void {
    globalThis.speechSynthesis.cancel();
  }
}
