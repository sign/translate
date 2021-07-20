import {AfterViewInit, Component, ElementRef, HostBinding, Input, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {combineLatest, Observable} from 'rxjs';
import {VideoSettings, VideoStateModel} from '../../core/modules/ngxs/store/video/video.state';
import Stats from 'stats.js';
import {distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../base/base.component';
import {wait} from '../../core/helpers/wait/wait';
import {PoseVideoFrame} from '../../modules/pose/pose.actions';
import {Pose, PoseStateModel} from '../../modules/pose/pose.state';
import {PoseService} from '../../modules/pose/pose.service';
import {SignWritingStateModel} from '../../modules/sign-writing/sign-writing.state';
import {SettingsStateModel} from '../../modules/settings/settings.state';
import {SignWritingService} from '../../modules/sign-writing/sign-writing.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent extends BaseComponent implements AfterViewInit {
  @Select(state => state.settings) settingsState$: Observable<SettingsStateModel>;
  @Select(state => state.settings.animatePose) animatePose$: Observable<boolean>;

  @Select(state => state.video) videoState$: Observable<VideoStateModel>;
  @Select(state => state.pose) poseState$: Observable<PoseStateModel>;
  @Select(state => state.signWriting) signWritingState$: Observable<SignWritingStateModel>;
  @Select(state => state.detector.signingProbability) signingProbability$: Observable<number>;

  @ViewChild('video') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('stats') statsEl: ElementRef;

  @HostBinding('class') aspectRatio = 'aspect-16-9';

  @Input() displayFps = true;
  @Input() displayControls = true;

  canvasCtx!: CanvasRenderingContext2D;

  fpsStats = new Stats();
  signingStats = new Stats();

  constructor(private store: Store,
              private poseService: PoseService,
              private signWritingService: SignWritingService,
              private elementRef: ElementRef) {
    super();
  }

  ngAfterViewInit(): void {
    this.setCamera();
    this.setStats();
    this.trackPose();

    this.canvasCtx = this.canvasEl.nativeElement.getContext('2d');
    this.preloadSignWritingFont();
    this.drawChanges();

    this.videoEl.nativeElement.addEventListener('loadeddata', this.appLoop.bind(this));

    // @ts-ignore
    const resizeObserver = new ResizeObserver(this.scaleCanvas.bind(this));
    resizeObserver.observe(this.elementRef.nativeElement);
  }

  async appLoop(): Promise<void> {
    // const fps = this.store.snapshot().video.videoSettings.frameRate;
    const video = this.videoEl.nativeElement;
    const poseAction = new PoseVideoFrame(this.videoEl.nativeElement);

    let lastTime = null;
    while (true) {
      if (video.readyState === 0) { // if video is no longer available
        break;
      }

      // Make sure the frame changed
      if (video.currentTime !== lastTime) {
        lastTime = video.currentTime;

        // Get pose estimation
        await this.store.dispatch(poseAction).toPromise();
      }

      await wait(0);
    }
  }

  setCamera(): void {
    const video = this.videoEl.nativeElement;
    video.muted = true;
    video.addEventListener('loadedmetadata', e => video.play());

    this.videoState$.pipe(
      tap(({camera, src}) => {
        // Either video feed or camera
        video.src = src || '';
        video.srcObject = camera;
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    this.videoState$.pipe(
      map(state => state.videoSettings),
      filter(Boolean),
      tap(({width, height}) => {
        this.canvasEl.nativeElement.width = width;
        this.canvasEl.nativeElement.height = height;

        // It is required to wait for next frame, as grid element might still be resizing
        requestAnimationFrame(this.scaleCanvas.bind(this));
      }),
      tap((settings: VideoSettings) => this.aspectRatio = 'aspect-' + settings.aspectRatio),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  scaleCanvas(): void {
    window.requestAnimationFrame(() => {
      // Zoom canvas to 100% width
      const bbox = this.elementRef.nativeElement.getBoundingClientRect();
      const scale = bbox.width / this.canvasEl.nativeElement.width;
      this.canvasEl.nativeElement.style.transform = `scale(${scale})`;

      // Set parent element height
      this.elementRef.nativeElement.style.height = this.canvasEl.nativeElement.height * scale + 'px';
    });
  }

  trackPose(): void {
    this.poseState$.pipe(
      map(state => state.pose),
      filter(Boolean),
      tap((pose: Pose) => {
        this.fpsStats.end(); // End previous frame time
        this.fpsStats.begin(); // Start new frame time
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  preloadSignWritingFont(): void {
    this.canvasCtx.font = '100px SignWriting';
    this.canvasCtx.fillText('Preload SignWriting', 0, 0);
  }

  drawChanges(): void {
    const ctx = this.canvasCtx;
    const canvas = ctx.canvas;
    combineLatest([this.poseState$, this.signWritingState$, this.settingsState$]).pipe(
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
    ).subscribe();

  }

  setStats(): void {
    this.fpsStats.showPanel(0);
    this.fpsStats.domElement.style.position = 'absolute';
    this.statsEl.nativeElement.appendChild(this.fpsStats.dom);

    // TODO this on change of input property
    if (!this.displayFps) {
      this.fpsStats.domElement.style.display = 'none';
    }

    // Sign detection panel
    const signingPanel = new Stats.Panel('Signing', '#ff8', '#221');
    this.signingStats.dom.innerHTML = '';
    this.signingStats.addPanel(signingPanel);
    this.signingStats.showPanel(0);
    this.signingStats.domElement.style.position = 'absolute';
    this.signingStats.domElement.style.left = '80px';
    this.statsEl.nativeElement.appendChild(this.signingStats.dom);

    this.setDetectorListener(signingPanel);
  }

  setDetectorListener(panel: Stats.Panel): void {
    // Update panel value
    this.signingProbability$.pipe(
      tap(v => panel.update(v * 100, 100)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    // Show hide panel
    this.settingsState$.pipe(
      map(settings => settings.detectSign),
      distinctUntilChanged(),
      tap(detectSign => {
        this.signingStats.domElement.style.display = detectSign ? 'block' : 'none';
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }
}
