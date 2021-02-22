// import {Injectable} from '@angular/core';
// import {Action, NgxsOnInit, Select, State, StateContext} from '@ngxs/store';
// import {Pose} from '../../../../services/pose/models/base.pose-model';
// import {DetectSigning, PoseVideoFrame} from './models.actions';
// import {PoseService} from '../../../../../modules/pose/pose.service';
// import {Observable} from 'rxjs';
// import {Hand} from '../settings/settings.state';
// import {tap} from 'rxjs/operators';
// import {DetectorService} from '../../../../services/detector/detector.service';
//
// export interface ModelsStateModel {
//   pose: Pose;
//   signingProbability: number;
//   isSigning: boolean;
// }
//
// const initialState: ModelsStateModel = {
//   pose: null,
//   signingProbability: 0,
//   isSigning: false
// };
//
// @Injectable()
// @State<ModelsStateModel>({
//   name: 'models',
//   defaults: initialState
// })
// export class ModelsState implements NgxsOnInit {
//   @Select(state => state.settings.dominantHand) dominantHand$: Observable<Hand>;
//   dominantHand: Hand = 'right';
//
//   constructor(private pose: PoseService, private detector: DetectorService) {
//
//   }
//
//   ngxsOnInit(ctx?: StateContext<any>): void {
//     this.dominantHand$.pipe(
//       tap(dominantHand => this.dominantHand = dominantHand)
//     ).subscribe();
//   }
//
//   @Action(PoseVideoFrame)
//   async poseFrame({patchState, dispatch}: StateContext<ModelsStateModel>, {video}: PoseVideoFrame): Promise<void> {
//     const pose = await this.pose.predict(video, this.dominantHand);
//
//     patchState({pose});
//     if (pose) { // If person detected
//       dispatch(DetectSigning);
//     } else {
//       patchState({isSigning: false});
//     }
//   }
//
//   @Action(DetectSigning)
//   async detectSigning({getState, patchState}: StateContext<ModelsStateModel>): Promise<void> {
//     const {pose} = getState();
//
//     const signingProbability = await this.detector.detect(pose);
//     patchState({
//       signingProbability,
//       isSigning: signingProbability > 0.5
//     });
//   }
// }
