import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Select, State, StateContext} from '@ngxs/store';
import {DetectorService} from './detector.service';
import {DetectSigning} from './detector.actions';
import {filter, first, tap} from 'rxjs/operators';
import {Pose} from '../pose/pose.state';
import {Observable} from 'rxjs';

export interface DetectorStateModel {
  signingProbability: number;
  isSigning: boolean;
}

const initialState: DetectorStateModel = {
  signingProbability: 0,
  isSigning: false
};

@Injectable()
@State<DetectorStateModel>({
  name: 'detector',
  defaults: initialState
})
export class DetectorState implements NgxsOnInit {
  detectSign = false;
  @Select(state => state.pose.pose) pose$: Observable<Pose>;
  @Select(state => state.settings.detectSign) detectSign$: Observable<boolean>;

  constructor(private detector: DetectorService) {
  }

  ngxsOnInit({patchState, dispatch}: StateContext<any>): void {
    // Load model once setting turns on
    this.detectSign$.pipe(
      filter(Boolean),
      first(),
      tap(() => this.detector.loadModel())
    ).subscribe();
    this.detectSign$.subscribe(detectSign => this.detectSign = detectSign);

    this.pose$.pipe(
      filter(Boolean),
      filter(() => this.detectSign), // Only run if needed
      tap((pose: Pose) => dispatch(new DetectSigning(pose)))
    ).subscribe();
  }

  @Action(DetectSigning)
  async detectSigning({getState, patchState}: StateContext<DetectorStateModel>, {pose}: DetectSigning): Promise<void> {
    const signingProbability = await this.detector.detect(pose);
    patchState({
      signingProbability,
      isSigning: signingProbability > 0.5
    });
  }
}
