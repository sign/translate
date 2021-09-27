import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent, Subscription} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SetSignedLanguageVideo} from '../../../modules/translate/translate.actions';
import {defineCustomElements as defineCustomElementsPoseViewer} from 'pose-viewer/loader';

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

const BPS = 2_000_000;

@Component({
  selector: 'app-pose-viewer',
  template: ``,
  styles: []
})
export abstract class BasePoseViewerComponent extends BaseComponent implements OnDestroy {
  @ViewChild('poseViewer') poseEl: ElementRef<HTMLPoseViewerElement>;

  mimeTypes = ['video/webm; codecs=vp9', 'video/webm; codecs=vp8', 'video/mp4', 'video/ogv'];
  mediaRecorder: MediaRecorder;

  cache: ImageData[] = [];
  cacheSubscription: Subscription;

  static isCustomElementDefined = false;

  protected constructor(private store: Store) {
    super();

    // Load the `pose-viewer` custom element
    if (!BasePoseViewerComponent.isCustomElementDefined) {
      defineCustomElementsPoseViewer().then().catch();
      BasePoseViewerComponent.isCustomElementDefined = true;
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
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

    // Must get canvas context for FireFox
    // https://stackoverflow.com/questions/63140354/firefox-gives-irregular-initialization-error-when-trying-to-use-navigator-mediad
    canvas.getContext('2d');
    const stream = canvas.captureStream(fps);

    let supportedMimeType: string;
    for (const mimeType of this.mimeTypes) {
      try {
        this.mediaRecorder = new MediaRecorder(stream, {mimeType, bitsPerSecond: BPS});
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

  addCacheData(image: ImageData): void {
    if ('VideoEncoder' in window) {
      // WebCodecs API is supported.
      console.warn('VideoEncoder video creation is supported, but not implemented');
    }

    this.cache.push(image);
  }

  reset(): void {
    if (this.cacheSubscription) {
      this.cacheSubscription.unsubscribe();
    }
    this.cache = [];
  }
}
