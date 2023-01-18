import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext, Store} from '@ngxs/store';
import {AnimationService} from './animation.service';
import {filter, first, tap} from 'rxjs/operators';
import {Pose} from '../pose/pose.state';
import {AnimatePose} from './animation.actions';

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
  isAnimatePose = false;
  pose$ = this.store.select<Pose>(state => state.pose.pose);
  animatePose$ = this.store.select<boolean>(state => state.settings.animatePose);

  constructor(private store: Store, private animation: AnimationService) {}

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
        tap((pose: Pose) => dispatch(new AnimatePose(pose)))
      )
      .subscribe();
  }

  @Action(AnimatePose)
  async animatePose({getState, patchState}: StateContext<AnimationStateModel>, {pose}: AnimatePose): Promise<void> {
    const tracks = this.animation.estimate([pose]);
    patchState({tracks});
  }
}
