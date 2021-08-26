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

  mimeTypes = ['video/webm; codecs=vp9', 'video/webm; codecs=vp8', 'video/mp4', 'video/ogv'];
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

  async startRecording(canvas: CanvasElement): Promise<void> {
    const recordedChunks: Blob[] = [];

    const pose = await this.poseEl.nativeElement.getPose();
    const fps = pose.body.fps;


    const stream = canvas.captureStream(fps);

    let supportedMimeType: string;
    for (const mimeType of this.mimeTypes) {
      try {
        this.mediaRecorder = new MediaRecorder(stream, {mimeType});
        supportedMimeType = mimeType;
        break;
      } catch (e) {
        console.warn(mimeType, 'not supported');
      }
    }

    if (!supportedMimeType) {
      return;
    }

    fromEvent(this.mediaRecorder, 'dataavailable').pipe(
      tap((event: BlobEvent) => recordedChunks.push(event.data)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    fromEvent(this.mediaRecorder, 'stop').pipe(
      tap(() => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(recordedChunks, {type: this.mediaRecorder.mimeType});
        const url = URL.createObjectURL(blob);
        this.setVideo(url);
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();


    const duration = this.poseEl.nativeElement.duration * 1000;
    this.mediaRecorder.start(duration);
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }
}
