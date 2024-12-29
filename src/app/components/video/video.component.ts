import {AfterViewInit, Component, ElementRef, HostBinding, inject, Input, viewChild} from '@angular/core';
import {Store} from '@ngxs/store';
import {combineLatest, firstValueFrom} from 'rxjs';
import {VideoSettings, VideoStateModel} from '../../core/modules/ngxs/store/video/video.state';
import Stats from 'stats.js';
import {distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../base/base.component';
import {wait} from '../../core/helpers/wait/wait';
import {LoadPoseEstimationModel, PoseVideoFrame} from '../../modules/pose/pose.actions';
import {PoseStateModel} from '../../modules/pose/pose.state';
import {PoseService} from '../../modules/pose/pose.service';
import {SignWritingStateModel} from '../../modules/sign-writing/sign-writing.state';
import {SettingsStateModel} from '../../modules/settings/settings.state';
import {SignWritingService} from '../../modules/sign-writing/sign-writing.service';
import {IonIcon} from '@ionic/angular/standalone';
import {VideoControlsComponent} from './video-controls/video-controls.component';
import {addIcons} from 'ionicons';
import {playCircleOutline} from 'ionicons/icons';
import {AsyncPipe} from '@angular/common';
import {TranslocoDirective, TranslocoPipe} from '@jsverse/transloco';
import {AnimationModule} from '../animation/animation.module';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  imports: [AnimationModule, VideoControlsComponent, IonIcon, AsyncPipe, TranslocoPipe, TranslocoDirective],
})
export class VideoComponent extends BaseComponent implements AfterViewInit {
  private store = inject(Store);

  settingsState$ = this.store.select<SettingsStateModel>(state => state.settings);
  animatePose$ = this.store.select<boolean>(state => state.settings.animatePose);

  videoState$ = this.store.select<VideoStateModel>(state => state.video);
  poseState$ = this.store.select<PoseStateModel>(state => state.pose);
  signWritingState$ = this.store.select<SignWritingStateModel>(state => state.signWriting);
  signingProbability$ = this.store.select<number>(state => state.detector.signingProbability);

  private poseService = inject(PoseService);
  private signWritingService = inject(SignWritingService);
  private elementRef = inject(ElementRef);

  readonly videoEl = viewChild<ElementRef<HTMLVideoElement>>('video');
  readonly canvasEl = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  readonly statsEl = viewChild<ElementRef>('stats');
  appRootEl!: HTMLElement;

  @HostBinding('class') aspectRatio = 'aspect-16-9';

  @Input() displayFps = true;
  @Input() displayControls = true;

  canvasCtx!: CanvasRenderingContext2D;

  videoEnded = false;

  fpsStats = new Stats();
  signingStats = new Stats();

  constructor() {
    super();

    if ('document' in globalThis) {
      this.appRootEl = document.querySelector('ion-app') ?? document.body;
    }

    addIcons({playCircleOutline});
  }

  ngAfterViewInit(): void {
    const videoEl = this.videoEl();
    this.setCamera();
    this.setStats();
    this.trackPose();

    this.canvasCtx = this.canvasEl().nativeElement.getContext('2d');
    this.preloadSignWritingFont();
    this.drawChanges();

    this.preloadPoseEstimationModel();
    videoEl.nativeElement.addEventListener('loadeddata', this.appLoop.bind(this));
    videoEl.nativeElement.addEventListener('ended', () => (this.videoEnded = true));

    const resizeObserver = new ResizeObserver(this.scaleCanvas.bind(this));
    resizeObserver.observe(this.elementRef.nativeElement);
    resizeObserver.observe(this.appRootEl); // Catch changes when canvas becomes bigger then screen
  }

  async appLoop(): Promise<void> {
    // const fps = this.store.snapshot().video.videoSettings.frameRate;
    const video = this.videoEl().nativeElement;
    const poseAction = new PoseVideoFrame(video);

    let lastTime = null;
    while (true) {
      if (video.readyState === 0) {
        // if video is no longer available
        break;
      }

      // Make sure the frame changed
      if (video.currentTime !== lastTime) {
        lastTime = video.currentTime;

        // Get pose estimation
        await firstValueFrom(this.store.dispatch(poseAction));
      }

      // TODO await videoframe if supported

      await wait(0);
    }
  }

  setCamera(): void {
    const video = this.videoEl().nativeElement;
    video.muted = true;
    video.addEventListener('loadedmetadata', () => video.play());

    this.videoState$
      .pipe(
        tap(({camera, src}) => {
          this.videoEnded = false;
          // Either video feed or camera
          video.src = src || '';
          video.srcObject = camera;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.videoState$
      .pipe(
        map(state => state.videoSettings),
        filter(Boolean),
        tap(({width, height}) => {
          const canvasEl = this.canvasEl();
          canvasEl.nativeElement.width = width;
          canvasEl.nativeElement.height = height;

          // It is required to wait for next frame, as grid element might still be resizing
          requestAnimationFrame(this.scaleCanvas.bind(this));
        }),
        tap((settings: VideoSettings) => (this.aspectRatio = 'aspect-' + settings.aspectRatio)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  scaleCanvas(): void {
    requestAnimationFrame(() => {
      // Zoom canvas to 100% width
      const bbox = this.elementRef.nativeElement.getBoundingClientRect();
      const documentBbox = this.appRootEl.getBoundingClientRect();

      const width = Math.min(bbox.width, documentBbox.width);
      const canvasEl = this.canvasEl().nativeElement;
      const scale = width / canvasEl.width;
      canvasEl.style.transform = `scale(-${scale}, ${scale}) translateX(-100%)`;

      // Set parent element height
      this.elementRef.nativeElement.style.height = canvasEl.height * scale + 'px';
      // Set canvas parent element width
      canvasEl.parentElement.style.width = width + 'px';
    });
  }

  trackPose(): void {
    this.poseState$
      .pipe(
        map(state => state.pose),
        filter(Boolean),
        tap(() => {
          this.fpsStats.end(); // End previous frame time
          this.fpsStats.begin(); // Start new frame time
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  preloadSignWritingFont(): void {
    this.canvasCtx.font = '100px SuttonSignWritingOneD';
    this.canvasCtx.fillText('Preload SignWriting', 0, 0);
  }

  preloadPoseEstimationModel(): void {
    this.store.dispatch(LoadPoseEstimationModel);
  }

  drawChanges(): void {
    const ctx = this.canvasCtx;
    const canvas = ctx.canvas;
    combineLatest([this.poseState$, this.signWritingState$, this.settingsState$])
      .pipe(
        distinctUntilChanged((x, y) => x[1].timestamp === y[1].timestamp),
        tap(([poseState, signWritingState, settingsState]) => {
          if (poseState.pose) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw video
            if (settingsState.drawVideo) {
              ctx.drawImage(poseState.pose.image, 0, 0, canvas.width, canvas.height);
            } else {
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Draw pose
            if (settingsState.drawPose) {
              this.poseService.draw(poseState.pose, ctx);
            }

            // Draw Sign Writing
            if (settingsState.drawSignWriting) {
              this.signWritingService.draw(signWritingState, ctx);
            }
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  setStats(): void {
    this.fpsStats.showPanel(0);
    this.fpsStats.dom.style.position = 'absolute';
    this.statsEl().nativeElement.appendChild(this.fpsStats.dom);

    // TODO this on change of input property
    if (!this.displayFps) {
      this.fpsStats.dom.style.display = 'none';
    }

    // Sign detection panel
    const signingPanel = new Stats.Panel('Signing', '#ff8', '#221');
    this.signingStats.dom.innerHTML = '';
    this.signingStats.addPanel(signingPanel);
    this.signingStats.showPanel(0);
    this.signingStats.dom.style.position = 'absolute';
    this.signingStats.dom.style.left = '80px';
    this.statsEl().nativeElement.appendChild(this.signingStats.dom);

    this.setDetectorListener(signingPanel);
  }

  setDetectorListener(panel: Stats.Panel): void {
    // Update panel value
    this.signingProbability$
      .pipe(
        tap(v => panel.update(v * 100, 100)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // TODO
    // Show hide panel
    this.settingsState$
      .pipe(
        map(settings => settings.detectSign),
        distinctUntilChanged(),
        tap(detectSign => {
          this.signingStats.dom.style.display = detectSign ? 'block' : 'none';
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  replayVideo() {
    this.videoEnded = false;
    const videoEl = this.videoEl().nativeElement;
    videoEl.currentTime = 0;
    return videoEl.play();
  }
}
