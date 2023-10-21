import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent, Subscription} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SetSignedLanguageVideo} from '../../../modules/translate/translate.actions';
import {ArrayBufferTarget as WebmArrayBufferTarget, Muxer as WebmMuxer} from 'webm-muxer';
import {Muxer as Mp4Muxer, ArrayBufferTarget as Mp4ArrayBufferTarget} from 'mp4-muxer';
import {isSafari} from '../../../core/constants';

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

  // Use a video encoder on supported browsers
  videoEncoder: VideoEncoder;
  videoType: 'webm' | 'mp4';
  muxer: WebmMuxer<WebmArrayBufferTarget> | Mp4Muxer<Mp4ArrayBufferTarget>;

  cache: ImageData[] = [];
  cacheSubscription: Subscription;

  frameIndex = 0;

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

  async createMuxer(image: ImageData): Promise<string> {
    // Creates the muxer and returns the relevant codec

    const fps = await this.fps();

    // TODO: this condition can be improved, to be based on the
    //  browser's support for the codecs rather than the browser itself
    if (isSafari) {
      const {Muxer, ArrayBufferTarget} = await import('mp4-muxer');
      this.videoType = 'mp4';
      this.muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
          codec: 'avc',
          width: image.width,
          height: image.height,
        },
      });

      return 'avc1.42001f';
    }

    const {Muxer, ArrayBufferTarget} = await import('webm-muxer');
    this.videoType = 'webm';
    this.muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: 'V_VP9',
        width: image.width,
        height: image.height,
        frameRate: fps,
        alpha: true,
      },
    });

    return 'vp09.00.10.08';
  }

  async initVideoEncoder(image: ImageData) {
    const codec = await this.createMuxer(image);

    this.videoEncoder = new VideoEncoder({
      output: (chunk, meta) => this.muxer.addVideoChunk(chunk, meta),
      error: e => console.error(e),
    });
    this.videoEncoder.configure({
      codec,
      width: image.width,
      height: image.height,
      bitrate: BPS,
      framerate: await this.fps(),
      // alpha: 'keep' TODO: this is not yet supported in Chrome https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/modules/webcodecs/video_encoder.cc#242
    });
  }

  async createEncodedVideo() {
    await this.videoEncoder.flush();
    this.muxer.finalize();

    let {buffer} = this.muxer.target; // Buffer contains final muxed file
    const blob = new Blob([buffer], {type: `video/${this.videoType}`});
    const url = URL.createObjectURL(blob);
    this.setVideo(url);

    this.videoEncoder.close();
    delete this.videoEncoder;
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

  async startRecording(canvas: HTMLCanvasElement): Promise<void> {
    // Must get canvas context for FireFox
    // https://stackoverflow.com/questions/63140354/firefox-gives-irregular-initialization-error-when-trying-to-use-navigator-mediad
    canvas.getContext('2d');
    const fps = await this.fps();
    const stream = canvas.captureStream(fps);

    this.initMediaRecorder(stream);
  }

  stopRecording(): void {
    if (this.videoEncoder) {
      void this.createEncodedVideo();
      return;
    }

    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  async addCacheFrame(image: ImageData): Promise<void> {
    if ('VideoEncoder' in window) {
      if (!this.videoEncoder) {
        await this.initVideoEncoder(image);
      }
      const ms = 1_000_000; // 1µs
      const fps = await this.fps();
      const frame = new VideoFrame(await createImageBitmap(image), {
        timestamp: (ms * this.frameIndex) / fps,
        duration: ms / fps,
      });
      this.videoEncoder.encode(frame);
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

    for (const subscription of this.mediaSubscriptions) {
      subscription.unsubscribe();
    }
    this.mediaSubscriptions = [];

    // Reset media recorder
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      delete this.mediaRecorder;
    }

    // Reset video encoder
    if (this.videoEncoder) {
      this.videoEncoder.close();
      delete this.videoEncoder;
      delete this.muxer;
    }
  }
}
