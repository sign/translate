import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SetSignedLanguageVideo} from '../../../modules/translate/translate.actions';

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

@Component({
  selector: 'app-pose-viewer',
  template: ``,
  styles: []
})
export abstract class BasePoseViewerComponent extends BaseComponent implements OnDestroy {
  @ViewChild('poseViewer') poseEl: ElementRef<HTMLPoseViewerElement>;

  mediaRecorder: MediaRecorder;

  protected constructor(private store: Store) {
    super();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  setVideo(url: string): void {
    this.store.dispatch(new SetSignedLanguageVideo(url));
  }

  startRecording(canvas: CanvasElement): void {
    const recordedChunks: Blob[] = [];

    const stream = canvas.captureStream(25);

    this.mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9'});

    fromEvent(this.mediaRecorder, 'dataavailable').pipe(
      tap((event: BlobEvent) => recordedChunks.push(event.data)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    fromEvent(this.mediaRecorder, 'stop').pipe(
      tap(() => {
        const blob = new Blob(recordedChunks, {type: 'video/webm'});
        const url = URL.createObjectURL(blob);
        this.setVideo(url);
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    this.mediaRecorder.start();
  }

  stopRecording(): void {
    this.mediaRecorder.stop();
  }
}
