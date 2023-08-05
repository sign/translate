import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent, Subscription} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SetSignedLanguageVideo} from '../../../modules/translate/translate.actions';
import {Capacitor} from '@capacitor/core';

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

const BPS = 1_000_000_000; // 1GBps, to act as infinity

@Component({
  selector: 'app-pose-viewer',
  template: ``,
  styles: [],
})
export abstract class BasePoseViewerComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('poseViewer') poseEl: ElementRef<HTMLPoseViewerElement>;

  // Using cache and MediaRecorder for older browsers, and safari
  mimeTypes = ['video/webm;codecs:vp9', 'video/webm;codecs:vp8', 'video/webm', 'video/mp4', 'video/ogv'];
  mediaRecorder: MediaRecorder;
  mediaSubscriptions: Subscription[] = [];

  // Use a writeable stream on supported browsers
  streamWriter: WritableStreamDefaultWriter;
  frameIndex = 0;

  cache: ImageData[] = [];
  cacheSubscription: Subscription;

  static isCustomElementDefined = false;

  protected constructor(protected store: Store) {
    super();
  }

  async ngOnInit() {
    await this.definePoseViewerElement();
  }

  async definePoseViewerElement() {
    // Load the `pose-viewer` custom element
    if (!BasePoseViewerComponent.isCustomElementDefined) {
      BasePoseViewerComponent.isCustomElementDefined = true;

      const {defineCustomElements} = await import(/* webpackChunkName: "pose-viewer" */ 'pose-viewer/loader');
      await defineCustomElements();
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
      if (MediaRecorder.isTypeSupported(mimeType)) {
        this.mediaRecorder = new MediaRecorder(stream, {mimeType, videoBitsPerSecond: BPS});
        supportedMimeType = mimeType;
        break;
      } else {
        console.warn(mimeType, 'not supported');
      }
    }

    if (!supportedMimeType) {
      return;
    }

    const dataAvailableEvent = fromEvent(this.mediaRecorder, 'dataavailable').pipe(
      tap((event: BlobEvent) => recordedChunks.push(event.data)),
      takeUntil(this.ngUnsubscribe)
    );
    this.mediaSubscriptions.push(dataAvailableEvent.subscribe());

    const stopEvent = fromEvent(this.mediaRecorder, 'stop').pipe(
      tap(async () => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(recordedChunks, {type: this.mediaRecorder.mimeType});
        console.log('recordedChunks', recordedChunks);
        console.log('blob', blob.size, blob.type);
        // TODO: this does not work in iOS. The blob above is of size 0, and the video does not play.
        //       Should open an issue that ios mediarecorder dataavailable blob size is 0
        //       https://webkit.org/blog/11353/mediarecorder-api/
        const url = URL.createObjectURL(blob);
        this.setVideo(url);
      }),
      takeUntil(this.ngUnsubscribe)
    );
    this.mediaSubscriptions.push(stopEvent.subscribe());

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
    if ('MediaStreamTrackGenerator' in window && false) {
      // Not ready for use: https://stackoverflow.com/questions/72693091/mediarecorder-ignoring-videoframe-timestamp
      if (!this.mediaRecorder) {
        const {stream, writer} = this.createMediaGeneratorTrack();
        this.streamWriter = writer;
        this.initMediaRecorder(stream);
      }
      const ms = 1_000_000; // 1µs
      const fps = await this.fps();
      const frame = new VideoFrame(await createImageBitmap(image), {
        // TODO timestamp is not actually respected!
        timestamp: (ms * this.frameIndex) / fps,
        duration: ms / fps,
      });
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

    for (const subscription of this.mediaSubscriptions) {
      subscription.unsubscribe();
    }
    this.mediaSubscriptions = [];

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
