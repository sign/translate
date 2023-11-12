import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent, Subscription} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SetSignedLanguageVideo} from '../../../modules/translate/translate.actions';
import type {ArrayBufferTarget as WebmArrayBufferTarget, Muxer as WebmMuxer} from 'webm-muxer';
import type {ArrayBufferTarget as Mp4ArrayBufferTarget, Muxer as Mp4Muxer} from 'mp4-muxer';
import {isSafari} from '../../../core/constants';

const BPS = 1_000_000_000; // 1GBps, to act as infinity

interface VideoCodecInfo {
  codec: string;
  forceEvenSizedFrames: boolean;
}

@Component({
  selector: 'app-pose-viewer',
  template: ``,
  styles: [],
})
export abstract class BasePoseViewerComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('poseViewer') poseEl: ElementRef<HTMLPoseViewerElement>;

  background: string = '';

  // Using cache and MediaRecorder for older browsers, and safari
  mimeTypes = ['video/webm; codecs:vp9', 'video/webm; codecs:vp8', 'video/webm', 'video/mp4', 'video/ogv'];
  mediaRecorder: MediaRecorder;
  mediaSubscriptions: Subscription[] = [];

  // Use a video encoder on supported browsers
  supportsVideoEncoder = 'VideoEncoder' in window;
  videoEncoder: VideoEncoder;
  videoType: 'webm' | 'mp4';
  muxer: WebmMuxer<WebmArrayBufferTarget> | Mp4Muxer<Mp4ArrayBufferTarget>;

  cache: ImageBitmap[] = [];
  cacheSubscription: Subscription;

  frameIndex = 0;

  static isCustomElementDefined = false;

  protected constructor(protected store: Store) {
    super();
  }

  async ngOnInit() {
    // Some browsers videos can't have a transparent background
    const isTransparencySupported =
      'chrome' in window && // transparency is currently not supported in firefox and safari
      !this.supportsVideoEncoder; // alpha is not yet supported in chrome VideoEncoder
    if (!isTransparencySupported) {
      // Make the video background the same as the parent element's background
      const el = document.querySelector('app-signed-language-output');
      if (el) {
        // el does not exist during testing
        this.background = getComputedStyle(el).backgroundColor;
      }
    }

    await this.definePoseViewerElement();
  }

  async definePoseViewerElement() {
    // Load the `pose-viewer` custom element
    if (!BasePoseViewerComponent.isCustomElementDefined) {
      BasePoseViewerComponent.isCustomElementDefined = true;

      const {defineCustomElements} = await import(/* webpackChunkName: "pose-viewer" */ 'pose-viewer/loader');
      defineCustomElements();
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

  videoDimensions(image: ImageBitmap, forceEvenSizedFrames: boolean = false) {
    let width = image.width;
    let height = image.height;

    if (forceEvenSizedFrames) {
      if (image.width % 2 !== 0) {
        width += 1;
      }
      if (image.height % 2 !== 0) {
        height += 1;
      }
    }

    return {width, height};
  }

  async createMuxer(image: ImageBitmap): Promise<VideoCodecInfo> {
    // Creates the muxer and returns the relevant codec

    const fps = await this.fps();

    // TODO: this condition can be improved, to be based on the
    //  browser's support for the codecs rather than the browser itself
    if (isSafari) {
      const {Muxer, ArrayBufferTarget} = await import('mp4-muxer');
      this.videoType = 'mp4';

      this.muxer = new Muxer({
        target: new ArrayBufferTarget(),
        fastStart: 'in-memory',
        video: {
          codec: 'avc',
          ...this.videoDimensions(image, true),
        },
      });

      return {
        codec: 'avc1.42001f',
        // H264 only supports even sized frames
        forceEvenSizedFrames: true,
      };
    }

    const {Muxer, ArrayBufferTarget} = await import('webm-muxer');
    this.videoType = 'webm';
    this.muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: 'V_VP9',
        ...this.videoDimensions(image),
        frameRate: fps,
        alpha: true,
      },
    });

    return {
      codec: 'avc1.42001f',
      forceEvenSizedFrames: false,
    };
  }

  async initVideoEncoder(image: ImageBitmap) {
    const {codec, forceEvenSizedFrames} = await this.createMuxer(image);

    this.videoEncoder = new VideoEncoder({
      output: (chunk, meta) => this.muxer.addVideoChunk(chunk, meta),
      error: e => console.error(e),
    });
    const config = {
      codec,
      ...this.videoDimensions(image, forceEvenSizedFrames),
      bitrate: BPS,
      framerate: await this.fps(),
      // alpha: 'keep' as AlphaOption // TODO: this is not yet supported in Chrome https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/modules/webcodecs/video_encoder.cc#242
    };
    this.videoEncoder.configure(config);
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

  async addCacheFrame(image: ImageBitmap): Promise<void> {
    if (this.supportsVideoEncoder) {
      if (!this.videoEncoder) {
        await this.initVideoEncoder(image);
      }
      const ms = 1_000_000; // 1µs
      const fps = await this.fps();
      const frame = new VideoFrame(image, {
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
