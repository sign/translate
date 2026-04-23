import {Component, ElementRef, inject, NgZone, OnDestroy, OnInit, viewChild} from '@angular/core';
import {Store} from '@ngxs/store';
import {BaseComponent} from '../../../components/base/base.component';
import {FrameCacheService} from '../../../core/services/frame-cache.service';
import {SetSignedLanguageVideo} from '../../../modules/translate/translate.actions';

@Component({
  selector: 'app-pose-viewer',
  template: ``,
  styles: [],
})
export abstract class BasePoseViewerComponent extends BaseComponent implements OnInit, OnDestroy {
  protected store = inject(Store);
  protected frameCache = inject(FrameCacheService);
  private zone = inject(NgZone);

  readonly poseEl = viewChild<ElementRef<HTMLPoseViewerElement>>('poseViewer');

  background: string = '';

  frameIndex = 0;

  static isCustomElementDefined = false;

  async ngOnInit() {
    const el = document.querySelector('app-signed-language-output');
    if (el) {
      this.background = getComputedStyle(el).backgroundColor;
    }

    await this.definePoseViewerElement();
  }

  async definePoseViewerElement() {
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

  async fps() {
    const pose = await this.poseEl().nativeElement.getPose();
    return pose.body.fps;
  }

  addCacheFrame(image: ImageBitmap, fps?: number): void {
    const isFirst = this.frameIndex === 0;
    this.frameCache.addFrame(image, fps);
    this.frameIndex++;
    if (isFirst) {
      this.zone.run(() => this.store.dispatch(new SetSignedLanguageVideo('ready')));
    }
  }

  reset(): void {
    this.frameCache.reset();
    this.frameIndex = 0;
  }
}
