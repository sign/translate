import {inject, Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext, Store} from '@ngxs/store';
import {AnimationService} from './animation.service';
import {filter, first, tap} from 'rxjs/operators';
import {EstimatedPose} from '../pose/pose.state';
import {AnimatePose} from './animation.actions';
import {Observable} from 'rxjs';

export interface AnimationStateModel {
  tracks: {[key: string]: [number, number, number, number][]};
}

const initialState: AnimationStateModel = {
  tracks: null,
};

@Injectable()
@State<AnimationStateModel>({
  name: 'animation',
  defaults: initialState,
})
export class AnimationState implements NgxsOnInit {
  private store = inject(Store);
  private animation = inject(AnimationService);

  isAnimatePose = false;
  pose$!: Observable<EstimatedPose>;
  animatePose$!: Observable<boolean>;

  constructor() {
    this.pose$ = this.store.select<EstimatedPose>(state => state.pose.pose);
    this.animatePose$ = this.store.select<boolean>(state => state.settings.animatePose);
  }

  ngxsOnInit({dispatch}: StateContext<any>): void {
    // Load model once setting turns on
    this.animatePose$
      .pipe(
        filter(Boolean),
        first(),
        tap(() => this.animation.loadModel())
      )
      .subscribe();
    this.animatePose$.subscribe(animatePose => (this.isAnimatePose = animatePose));

    this.pose$
      .pipe(
        filter(Boolean),
        filter(() => this.isAnimatePose), // Only run if needed
        tap((pose: EstimatedPose) => dispatch(new AnimatePose(pose)))
      )
      .subscribe();
  }

  @Action(AnimatePose)
  async animatePose({getState, patchState}: StateContext<AnimationStateModel>, {pose}: AnimatePose): Promise<void> {
    const tracks = this.animation.estimate([pose]);
    patchState({tracks});
  }
}
