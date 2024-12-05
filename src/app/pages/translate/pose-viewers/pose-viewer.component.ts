import {Component, ElementRef, inject, OnDestroy, OnInit, viewChild} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent, Subscription} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {SetSignedLanguageVideo} from '../../../modules/translate/translate.actions';
import {PlayableVideoEncoder} from './playable-video-encoder';
import {isChrome} from '../../../core/constants';

@Component({
  selector: 'app-pose-viewer',
  template: ``,
  styles: [],
})
export abstract class BasePoseViewerComponent extends BaseComponent implements OnInit, OnDestroy {
  protected store = inject(Store);

  readonly poseEl = viewChild<ElementRef<HTMLPoseViewerElement>>('poseViewer');

  background: string = '';

  // Using cache and MediaRecorder for older browsers, and safari
  mimeTypes = ['video/webm; codecs:vp9', 'video/webm; codecs:vp8', 'video/webm', 'video/mp4', 'video/ogv'];
  mediaRecorder: MediaRecorder;
  mediaSubscriptions: Subscription[] = [];

  // Use a video encoder on supported browsers
  videoEncoder: PlayableVideoEncoder;

  cache: ImageBitmap[] = [];
  cacheSubscription: Subscription;

  frameIndex = 0;

  static isCustomElementDefined = false;

  async ngOnInit() {
    // Some browsers videos can't have a transparent background
    const isTransparencySupported =
      isChrome && // transparency is currently not supported in firefox and safari
      !PlayableVideoEncoder.isSupported(); // alpha is not yet supported in chrome VideoEncoder
    // TODO check if alpha is supported in Video Muxer
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

    this.reset();
  }

  setVideo(url: string): void {
    this.store.dispatch(new SetSignedLanguageVideo(url));
  }

  async fps() {
    const pose = await this.poseEl().nativeElement.getPose();
    return pose.body.fps;
  }

  async initVideoEncoder(image: ImageBitmap) {
    const fps = await this.fps();
    this.videoEncoder = new PlayableVideoEncoder(image, fps);
    await this.videoEncoder.init();
  }

  async createEncodedVideo() {
    const blob = await this.videoEncoder.finalize();
    const url = URL.createObjectURL(blob);
    this.setVideo(url);
  }

  initMediaRecorder(stream: MediaStream) {
    const recordedChunks: Blob[] = [];

    let supportedMimeType: string;
    for (const mimeType of this.mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        const videoBitsPerSecond = 1_000_000_000; // 1Gbps to act as infinity
        this.mediaRecorder = new MediaRecorder(stream, {mimeType, videoBitsPerSecond});
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

    const duration = this.poseEl().nativeElement.duration * 1000;
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
    if (PlayableVideoEncoder.isSupported()) {
      if (!this.videoEncoder) {
        await this.initVideoEncoder(image);
      }
      this.videoEncoder.addFrame(this.frameIndex, image);
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
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
      delete this.mediaRecorder;
    }

    // Reset video encoder
    if (this.videoEncoder) {
      this.videoEncoder.close();
    }
  }
}
