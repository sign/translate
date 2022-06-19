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

const BPS = 1_000_000_000; // 1GBps, to act as infinity

@Component({
  selector: 'app-pose-viewer',
  template: ``,
  styles: [],
})
export abstract class BasePoseViewerComponent extends BaseComponent implements OnDestroy {
  @ViewChild('poseViewer') poseEl: ElementRef<HTMLPoseViewerElement>;

  // Using cache and MediaRecorder for older browsers, and safari
  mimeTypes = ['video/webm; codecs=vp9', 'video/webm; codecs=vp8', 'video/webm', 'video/mp4', 'video/ogv'];
  mediaRecorder: MediaRecorder;

  // Use a writeable stream on supported browsers
  streamWriter: WritableStreamDefaultWriter;
  frameIndex = 0;

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

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  setVideo(url: string): void {
    this.store.dispatch(new SetSignedLanguageVideo(url));
  }

  async fps() {
    const pose = await this.poseEl.nativeElement.getPose();
    return pose.body.fps;
  }

  initMediaRecorder(stream: MediaStream) {
    const recordedChunks: Blob[] = [];

    let supportedMimeType: string;
    for (const mimeType of this.mimeTypes) {
      try {
        this.mediaRecorder = new MediaRecorder(stream, {mimeType, videoBitsPerSecond: BPS});
        supportedMimeType = mimeType;
        break;
      } catch (e) {
        console.warn(mimeType, 'not supported');
      }
    }

    if (!supportedMimeType) {
      return;
    }

    fromEvent(this.mediaRecorder, 'dataavailable')
      .pipe(
        tap((event: BlobEvent) => recordedChunks.push(event.data)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    fromEvent(this.mediaRecorder, 'stop')
      .pipe(
        tap(() => {
          stream.getTracks().forEach(track => track.stop());
          const blob = new Blob(recordedChunks, {type: this.mediaRecorder.mimeType});
          const url = URL.createObjectURL(blob);
          this.setVideo(url);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    const duration = this.poseEl.nativeElement.duration * 1000;
    this.mediaRecorder.start(duration);
  }

  async startRecording(canvas: CanvasElement): Promise<void> {
    // Must get canvas context for FireFox
    // https://stackoverflow.com/questions/63140354/firefox-gives-irregular-initialization-error-when-trying-to-use-navigator-mediad
    canvas.getContext('2d');
    const fps = await this.fps();
    const stream = canvas.captureStream(fps);

    this.initMediaRecorder(stream);
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  createMediaGeneratorTrack() {
    const generator = new MediaStreamTrackGenerator({kind: 'video'});
    const writer = generator.writable.getWriter();
    const stream = new MediaStream();
    stream.addTrack(generator);
    return {stream, writer};
  }

  async addCacheFrame(image: ImageData): Promise<void> {
    if ('MediaStreamTrackGenerator' in window) {
      if (!this.mediaRecorder) {
        const {stream, writer} = this.createMediaGeneratorTrack();
        this.streamWriter = writer;
        this.initMediaRecorder(stream);
      }
      const timestamp = (1_000_000 * this.frameIndex) / (await this.fps()); // Timestamp in µs
      // TODO timestamp is not actually respected!
      const frame = new VideoFrame(await createImageBitmap(image), {timestamp});
      await this.streamWriter.write(frame);
      frame.close();
    } else {
      this.cache.push(image);
    }

    this.frameIndex++;
  }

  reset(): void {
    // Reset cache
    if (this.cacheSubscription) {
      this.cacheSubscription.unsubscribe();
    }
    this.cache = [];
    this.frameIndex = 0;

    // Reset media recorder
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      delete this.mediaRecorder;
    }

    // Close stream writer
    if (this.streamWriter) {
      this.streamWriter.close().then().catch();
    }
  }
}
