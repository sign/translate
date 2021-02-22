import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '../base/base.component';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AudioStateModel} from '../../core/modules/ngxs/store/audio/audio.state';
import {distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent extends BaseComponent implements OnInit, OnDestroy {
  @Select(state => state.audio) audioState$: Observable<AudioStateModel>;

  @Input() playState: Observable<boolean>;

  backgroundPlayer: HTMLAudioElement = document.createElement('audio');
  foregroundPlayer: HTMLAudioElement = document.createElement('audio');


  ngOnInit(): void {
    this.createBackgroundWave();

    this.audioState$.pipe(
      tap(state => this.setMicrophone(state.microphone)), // Set Microphone
      map(state => state.speakerSink),
      filter(Boolean),
      tap((sink: any) => this.setVAC(sink.id)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    // Play/pause
    this.playState.pipe(
      distinctUntilChanged(),
      tap(play => {
        if (play) {
          this.play();
        } else {
          this.pause();
        }
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.pause();
    this.foregroundPlayer.pause();
  }

  createBackgroundWave(): OscillatorNode {
    const audioCtx = new AudioContext();
    window.addEventListener('load', () => {
      audioCtx.resume();
      setTimeout(() => audioCtx.resume(), 5000);
    });

    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 20000;

    const gainNode = audioCtx.createGain();
    const streamNode = audioCtx.createMediaStreamDestination();

    oscillator.connect(gainNode);
    gainNode.connect(streamNode);
    gainNode.gain.value = 0.6;

    oscillator.start(0);
    this.backgroundPlayer.srcObject = streamNode.stream;
    console.log('Background', this.backgroundPlayer);


    return oscillator;
  }

  async setVAC(sinkId: string): Promise<any> {
    console.log('setVAC', sinkId);
    return Promise.all([
      (this.backgroundPlayer as any).setSinkId(sinkId),
      // (this.foregroundPlayer as any).setSinkId(sinkId),
    ]);
  }

  async setMicrophone(microphone: MediaStream): Promise<void> {
    // this.foregroundPlayer.srcObject = microphone;
    if (microphone) {
      return this.foregroundPlayer.play();
    } else {
      return this.foregroundPlayer.pause();
    }
  }

  play(): Promise<void> {
    // if (!this.foregroundPlayer.srcObject) {
    //   return;
    // }

    console.log('PLAY');

    return this.backgroundPlayer.play();
  }

  pause(): void {
    console.log('PAUSE');

    return this.backgroundPlayer.pause();
  }
}
