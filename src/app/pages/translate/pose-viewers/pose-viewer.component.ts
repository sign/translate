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
  styles: [],
})
export abstract class BasePoseViewerComponent extends BaseComponent implements OnDestroy {
  @ViewChild('poseViewer') poseEl: ElementRef<HTMLPoseViewerElement>;

  // Using cache and MediaRecorder for older browsers, and safari
  mimeTypes = ['video/webm; codecs=vp9', 'video/webm; codecs=vp8', 'video/mp4', 'video/ogv'];
  mediaRecorder: MediaRecorder;

  cache: ImageData[] = [];
  cacheSubscription: Subscription;

  // Using the better, VideoEncoder for newer browsers
  videoEncoder: VideoEncoder;
  videoEncoderChunks: ArrayBuffer[] = [];

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

  async createVideoEncoder(image: ImageData): Promise<VideoEncoder> {
    let encoder = new VideoEncoder({
      output: (chunk, metadata) => {
        console.log(chunk, metadata);
        const buffer = new ArrayBuffer(chunk.byteLength);
        chunk.copyTo(buffer);
        this.videoEncoderChunks.push(buffer);
      },
      error: e => console.error(e.message),
    });

    encoder.configure({
      codec: 'vp8',
      width: image.width,
      height: image.height,
      bitrate: BPS,
      framerate: await this.fps(),
    });

    return encoder;
  }

  async createEncodedVideo() {
    if (this.videoEncoderChunks.length === 0) {
      return;
    }

    await this.videoEncoder.flush();

    const blob = new Blob(this.videoEncoderChunks, {type: 'video/mp4'});
    console.log({blob});
    const url = URL.createObjectURL(blob);
    console.log({url});
    this.setVideo(url);

    this.videoEncoder.close();
    delete this.videoEncoder;
  }

  async startRecording(canvas: CanvasElement): Promise<void> {
    const recordedChunks: Blob[] = [];

    const fps = await this.fps();

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

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  async addCacheFrame(image: ImageData): Promise<void> {
    if ('VideoEncoder' in window) {
      if (!this.videoEncoder) {
        this.videoEncoder = await this.createVideoEncoder(image);
      }
      const frame = new VideoFrame(await createImageBitmap(image));
      this.videoEncoder.encode(frame, {keyFrame: true});
      frame.close();
    } else {
      this.cache.push(image);
    }
  }

  reset(): void {
    // Reset cache
    if (this.cacheSubscription) {
      this.cacheSubscription.unsubscribe();
    }
    this.cache = [];

    // Reset video encoder
    if (this.videoEncoder) {
      this.videoEncoder.close();
      delete this.videoEncoder;
    }
    this.videoEncoderChunks = [];
  }
}
