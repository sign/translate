import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext, Store} from '@ngxs/store';
import {DetectorService} from './detector.service';
import {DetectSigning} from './detector.actions';
import {filter, first, tap} from 'rxjs/operators';
import {Pose} from '../pose/pose.state';

export interface DetectorStateModel {
  signingProbability: number;
  isSigning: boolean;
}

const initialState: DetectorStateModel = {
  signingProbability: 0,
  isSigning: false,
};

@Injectable()
@State<DetectorStateModel>({
  name: 'detector',
  defaults: initialState,
})
export class DetectorState implements NgxsOnInit {
  detectSign = false;
  pose$ = this.store.select<Pose>(state => state.pose.pose);
  detectSign$ = this.store.select<boolean>(state => state.settings.detectSign);

  constructor(private store: Store, private detector: DetectorService) {}

  ngxsOnInit({dispatch}: StateContext<any>): void {
    // Load model once setting turns on
    this.detectSign$
      .pipe(
        filter(Boolean),
        first(),
        tap(() => this.detector.loadModel())
      )
      .subscribe();
    this.detectSign$.subscribe(detectSign => (this.detectSign = detectSign));

    this.pose$
      .pipe(
        filter(Boolean),
        filter(() => this.detectSign), // Only run if needed
        tap((pose: Pose) => dispatch(new DetectSigning(pose)))
      )
      .subscribe();
  }

  @Action(DetectSigning)
  detectSigning({getState, patchState}: StateContext<DetectorStateModel>, {pose}: DetectSigning): void {
    const signingProbability = this.detector.detect(pose);
    patchState({
      signingProbability,
      isSigning: signingProbability > 0.5,
    });
  }
}
