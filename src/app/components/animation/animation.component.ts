import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import '@google/model-viewer';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AnimationStateModel} from '../../modules/animation/animation.state';
import {BaseComponent} from '../base/base.component';
import {map, takeUntil, tap} from 'rxjs/operators';
import * as THREE from 'three';


@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.css']
})
export class AnimationComponent extends BaseComponent implements AfterViewInit {

  @Select(state => state.animation) animationState$: Observable<AnimationStateModel>;

  @ViewChild('modelViewer') modelViewerEl: ElementRef<HTMLMediaElement>;

  ngAfterViewInit(): void {
    // Always render highest quality
    const ModelViewerElement = customElements.get('model-viewer');
    ModelViewerElement.minimumRenderScale = 1;

    let i = 0;
    const el = this.modelViewerEl.nativeElement;

    el.play();
    const scene = el[Object.getOwnPropertySymbols(el)[14]];

    this.animationState$.pipe(
      map(a => a.tracks),
      tap((trackDict) => {
        const name = 'u' + (i++);
        const tracks = [new THREE.VectorKeyframeTrack('mixamorigHips.position', [0], [0, 0, 0])];
        if (trackDict) {
          Object.entries(trackDict).forEach(([k, q]) => {
            tracks.push(new THREE.QuaternionKeyframeTrack(k, [0], q));
          });
        }
        const newAnimation = new THREE.AnimationClip(name, 0, tracks);

        scene.animationsByName.set(name, newAnimation);
        scene.playAnimation(name);
        if (el.paused) {
          el.play();
        }
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

}
